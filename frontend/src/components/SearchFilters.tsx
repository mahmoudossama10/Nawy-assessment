"use client";

import React, { FormEvent, useState } from 'react';


interface SearchFiltersProps {
  projects: string[];
  search?: string;
  project?: string;
  onFilter?: (search: string, project: string) => void;
}

function SearchFilters({ projects, search: searchProp = '', project: projectProp = '', onFilter }: SearchFiltersProps) {
  

  const [search, setSearch] = useState(searchProp);
  const [project, setProject] = useState(projectProp);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onFilter) {
      onFilter(search, project);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setProject('');
    if (onFilter) {
      onFilter('', '');
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
    >
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

