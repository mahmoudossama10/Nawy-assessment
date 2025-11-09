"use client";

import React, { FormEvent, useState } from 'react';

/**
 * SearchFilters is a controlled form component that manages apartment search and filtering.
 * 
 * Architecture & Design Decisions:
 * 1. Client Component ("use client"): Required for interactive form state management
 *    and immediate feedback without server roundtrips.
 * 
 * 2. Controlled Component Pattern:
 *    - Accepts initial values via props (search, project)
 *    - Maintains internal state for smooth UX
 *    - Propagates changes via onFilter callback
 *    This pattern allows both local state for responsiveness and parent control for persistence/routing.
 * 
 * 3. Memoization:
 *    Component is memoized to prevent unnecessary re-renders when parent data unrelated
 *    to search/filters changes (e.g. apartment list updates that don't affect filters).
 */
interface SearchFiltersProps {
  /** List of available project names for the dropdown */
  projects: string[];
  /** Initial search text value */
  search?: string;
  /** Initial selected project value */
  project?: string;
  /** Callback fired when filters change. Parent can use this to update URL/state */
  onFilter?: (search: string, project: string) => void;
}

function SearchFilters({ projects, search: searchProp = '', project: projectProp = '', onFilter }: SearchFiltersProps) {
  

  // Local state for form values, initialized from props for controlled component pattern
  const [search, setSearch] = useState(searchProp);
  const [project, setProject] = useState(projectProp);

  /**
   * Handle form submission by preventing default browser behavior and
   * propagating current filter state to parent component.
   * 
   * This two-way binding pattern (local state + parent updates) enables:
   * 1. Instant local updates for responsive UX
   * 2. Parent synchronization for persistence/routing
   * 3. Proper form submission behavior for accessibility
   */
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onFilter) {
      onFilter(search, project);
    }
  };

  /**
   * Reset both local state and parent filters to initial values.
   * This ensures consistency between local and parent state,
   * preventing stale filter data.
   */
  const resetFilters = () => {
    setSearch('');
    setProject('');
    if (onFilter) {
      onFilter('', '');
    }
  };

  /**
   * The form layout uses a responsive design pattern:
   * - Mobile: Stacked vertical layout (flex-col)
   * - Desktop: Single row layout (sm:flex-row)
   * 
   * Key UI/UX considerations:
   * 1. Semantic HTML: Uses <form>, <label>, and proper button types
   * 2. Accessibility: Labels and inputs are properly associated
   * 3. Visual Hierarchy: Shadow and borders for depth
   * 4. Responsive Design: Adapts layout for different screen sizes
   * 5. Input Styling: Consistent with design system (rounded-xl, brand colors)
   */
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
    >
      {/* Search input with flex-1 to take remaining space */}
      <div className="flex-1">
        <label htmlFor="search" className="mb-1 block text-sm font-medium text-slate-600">
          Search by unit name, number, or project
        </label>
        <input
          id="search"
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="e.g. Sunset, A-1205"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {/* Project dropdown with fixed width on desktop */}
      <div className="sm:w-64">
        <label htmlFor="project" className="mb-1 block text-sm font-medium text-slate-600">
          Project
        </label>
        <select
          id="project"
          name="project"
          value={project}
          onChange={(event) => setProject(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          <option value="">All projects</option>
          {projects.map((projectName) => (
            <option key={projectName} value={projectName}>
              {projectName}
            </option>
          ))}
        </select>
      </div>

      {/* Action buttons with responsive width behavior */}
      <div className="flex gap-3 sm:w-auto">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 sm:flex-none"
        >
          Search
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:flex-none"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default React.memo(SearchFilters);

