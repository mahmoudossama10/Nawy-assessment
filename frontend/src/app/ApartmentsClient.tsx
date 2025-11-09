"use client";

/**
 * This module bridges Next.js server components with client-side filtering and pagination.
 * It splits from the server-rendered page.tsx to handle interactive features while
 * maintaining SEO benefits from the initial server render.
 * 
 * Key interactions:
 * - Coordinates with SearchFilters for URL-based state management
 * - Feeds ApartmentGrid with memoized data to prevent cascading rerenders
 * - Works with api.ts which handles backend communication and error boundaries
 */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useSWR from "swr";
import SearchFilters from "@/components/SearchFilters";
import ApartmentGrid from '@/components/ApartmentGrid';
import type { Apartment } from '@/types/apartment';
import { fetchApartments, fetchProjects } from "@/lib/api";

// SWR's URL-based cache key is transformed into API parameters.
// This pattern allows the cache key to be human-readable while keeping
// API calls consistent with backend expectations.
const fetcher = async (url: string) => {
  const params = Object.fromEntries(new URLSearchParams(url.split("?")[1]));
  return fetchApartments(params);
};

/**
 * Client-side application core that manages the apartment browsing experience.
 * 
 * Architecture notes:
 * - Intentionally separated from page.tsx to maintain Next.js selective hydration
 * - State lives here instead of URL to avoid full page reloads
 * - Drives SearchFilters and ApartmentGrid through controlled props pattern
 * - Works with SWR's cache to reduce API load during back/forward navigation
 */
export default function ApartmentsClient() {
  // Local state preferred over URL parameters to enable smooth transitions
  // This avoids Next.js route changes while maintaining a clean URL structure
  const [search, setSearch] = useState("");
  const [project, setProject] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Query construction matches backend's expectation format
  // Empty filters are omitted to keep URLs clean and cache keys minimal
  const query = new URLSearchParams({
    ...(search ? { search } : {}),
    ...(project ? { project } : {}),
    page: String(page),
    pageSize: String(pageSize),
  }).toString();

  // SWR integration point - connects our UI to the backend while maintaining cache
  // The URL structure here forms our cache key strategy, enabling granular cache invalidation
  const { data, isLoading } = useSWR(`/api/apartments?${query}`, fetcher);

  // Advanced state persistence strategy to prevent layout shifts
  // This solves the common SWR flash issue during revalidation
  // Used by ApartmentGrid to maintain visual stability
  const [lastData, setLastData] = useState<any | null>(null);
  useEffect(() => {
    if (data) setLastData(data);
  }, [data]);

  // Fallback chain: current -> previous -> empty
  // This progressive enhancement approach ensures ApartmentGrid always has consistent props
  const renderData = data ?? lastData ?? { items: [], meta: { page: 1, pageSize: 9, total: 0, totalPages: 1 } };
  const { items = [], meta = { page: 1, pageSize: 9, total: 0, totalPages: 1 } } = renderData;

  // Deep equality check through concatenated keys
  // This powers ApartmentGrid's ability to skip renders when data hasn't materially changed
  const itemsKey = useMemo(() => items.map((a: Apartment) => `${a.id}:${a.updatedAt}`).join('|'), [items]);
  const itemsMemo = useMemo(() => items, [itemsKey]);

  // Projects are cached separately from apartments to enable independent updates
  // This cache separation lets us invalidate apartment data without losing project options
  const { data: projectsData } = useSWR("projects", fetchProjects);
  const projectOptions = projectsData || [];
  const memoProjectOptions = useMemo(() => projectOptions, [projectOptions.length, projectOptions.join('|')]);

  // Scroll preservation system - critical for maintaining user position during filter/page changes
  // Works in conjunction with the effect below to create smooth transitions
  const scrollPosRef = useRef(0);

  // Part of the scroll management system - captures position before state changes
  // SSR-safe implementation that gracefully degrades if window is not available
  const captureScroll = useCallback(() => {
    try {
      scrollPosRef.current = window.scrollY || 0;
    } catch (e) {
      scrollPosRef.current = 0;
    }
  }, []);

  // Filter coordinator - manages the relationship between SearchFilters and data fetching
  // Resets pagination to ensure users see the start of new result sets
  // Connected to SearchFilters through controlled props pattern
  const handleFilter = useCallback((newSearch: string, newProject: string) => {
    captureScroll();
    setSearch(newSearch);
    setProject(newProject);
    setPage(1);
  }, [captureScroll]);

  // Pagination system - these handlers maintain scroll position during page transitions
  // The automatic scroll restoration is disabled since we manage position manually
  const onPrev = useCallback(() => {
    captureScroll();
    setPage((p) => Math.max(1, p - 1));
  }, [captureScroll]);
  const onNext = useCallback(() => {
    captureScroll();
    setPage((p) => Math.min(meta.totalPages, p + 1));
  }, [meta.totalPages, captureScroll]);

  // Scroll restoration logic - works with the capture system above
  // Uses 'auto' behavior to prevent animation artifacts during data transitions
  useEffect(() => {
    if (data) {
      try {
        window.scrollTo({ top: scrollPosRef.current, left: 0, behavior: 'auto' });
      } catch (e) {
        // Graceful degradation for environments without scroll APIs
      }
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-8">
      <SearchFilters
        projects={memoProjectOptions}
        search={search}
        project={project}
        onFilter={handleFilter}
      />
      <section>
        {isLoading ? (
          <div>Loading…</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No apartments found. Try adjusting your search or filters.
          </div>
        ) : (
          <ApartmentGrid items={itemsMemo} />
        )}
      </section>
      {meta.totalPages > 1 && (
        <nav className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing
            <strong className="mx-1 text-slate-900">
              {Math.min(meta.page * meta.pageSize, meta.total)}
            </strong>
            of
            <strong className="mx-1 text-slate-900">{meta.total}</strong>
            apartments
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={onPrev}
              className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Previous
            </button>
            <span className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={onNext}
              className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
