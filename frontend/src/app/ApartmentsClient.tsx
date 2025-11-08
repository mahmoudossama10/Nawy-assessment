"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useSWR from "swr";
import ApartmentCard from "@/components/ApartmentCard";
import SearchFilters from "@/components/SearchFilters";
import ApartmentGrid from '@/components/ApartmentGrid';
import type { Apartment } from '@/types/apartment';
import { fetchApartments, fetchProjects } from "@/lib/api";

const fetcher = async (url: string) => {
  const params = Object.fromEntries(new URLSearchParams(url.split("?")[1]));
  return fetchApartments(params);
};

export default function ApartmentsClient() {
  const [search, setSearch] = useState("");
  const [project, setProject] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const query = new URLSearchParams({
    ...(search ? { search } : {}),
    ...(project ? { project } : {}),
    page: String(page),
    pageSize: String(pageSize),
  }).toString();

  const { data, isLoading } = useSWR(`/api/apartments?${query}`, fetcher);

  // Keep last successful data to avoid blank state / layout jump while loading
  const [lastData, setLastData] = useState<any | null>(null);
  useEffect(() => {
    if (data) setLastData(data);
  }, [data]);

  const renderData = data ?? lastData ?? { items: [], meta: { page: 1, pageSize: 9, total: 0, totalPages: 1 } };
  const { items = [], meta = { page: 1, pageSize: 9, total: 0, totalPages: 1 } } = renderData;
  const itemsKey = useMemo(() => items.map((a: Apartment) => `${a.id}:${a.updatedAt}`).join('|'), [items]);
  const itemsMemo = useMemo(() => items, [itemsKey]);

  // Fetch projects only once
  const { data: projectsData } = useSWR("projects", fetchProjects);
  const projectOptions = projectsData || [];
  const memoProjectOptions = useMemo(() => projectOptions, [projectOptions.length, projectOptions.join('|')]);

  const scrollPosRef = useRef(0);

  const captureScroll = useCallback(() => {
    try {
      scrollPosRef.current = window.scrollY || 0;
    } catch (e) {
      scrollPosRef.current = 0;
    }
  }, []);

  const handleFilter = useCallback((newSearch: string, newProject: string) => {
    captureScroll();
    setSearch(newSearch);
    setProject(newProject);
    setPage(1); // Reset to first page on filter
  }, [captureScroll]);

  // pagination callbacks
  const onPrev = useCallback(() => {
    captureScroll();
    setPage((p) => Math.max(1, p - 1));
  }, [captureScroll]);
  const onNext = useCallback(() => {
    captureScroll();
    setPage((p) => Math.min(meta.totalPages, p + 1));
  }, [meta.totalPages, captureScroll]);

  // restore scroll position after new data arrives
  useEffect(() => {
    if (data) {
      try {
        window.scrollTo({ top: scrollPosRef.current, left: 0, behavior: 'auto' });
      } catch (e) {
        // ignore
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
