import Link from 'next/link';
import ApartmentCard from '@/components/ApartmentCard';
import SearchFilters from '@/components/SearchFilters';
import { fetchApartments, fetchProjects } from '@/lib/api';

export const dynamic = 'force-dynamic';

type SearchParamValue = string | string[] | undefined;

interface HomePageProps {
  searchParams?: Record<string, SearchParamValue>;
}

const toStringParam = (value: SearchParamValue) => {
  if (Array.isArray(value)) {
    return value.at(-1);
  }
  return value;
};

const parseNumber = (value: SearchParamValue, fallback: number) => {
  const parsed = Number(toStringParam(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const search = toStringParam(searchParams?.search);
  const project = toStringParam(searchParams?.project);
  const pageSizeParam = toStringParam(searchParams?.pageSize);
  const page = parseNumber(searchParams?.page, 1);
  const pageSize = parseNumber(searchParams?.pageSize, 9);

  const { items, meta } = await fetchApartments({
    search,
    project,
    page,
    pageSize
  });

  // Fetch global list of projects so the select shows all projects, not only those on the current page
  const allProjects = await fetchProjects();
  const projectOptionsSet = new Set(allProjects);
  if (project) projectOptionsSet.add(project);
  const projectOptions = Array.from(projectOptionsSet).sort();

  const baseQuery = new URLSearchParams();
  if (search) baseQuery.set('search', search);
  if (project) baseQuery.set('project', project);
  if (pageSizeParam) {
    baseQuery.set('pageSize', pageSizeParam);
  } else if (pageSize !== 9) {
    baseQuery.set('pageSize', String(pageSize));
  }

  const buildPageHref = (pageNumber: number) => {
    const params = new URLSearchParams(baseQuery);
    if (pageNumber <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(pageNumber));
    }
    const query = params.toString();
    return query ? `/?${query}` : '/';
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-0">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Explore handpicked apartments
        </h1>
        <p className="max-w-2xl text-slate-600">
          Browse a curated selection of apartments with detailed amenities, pricing, and neighborhood highlights. Use the filters below to narrow down the perfect match.
        </p>
      </section>

      <SearchFilters projects={projectOptions} />

      <section>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No apartments found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
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
            {meta.page > 1 ? (
              <Link
                href={buildPageHref(meta.page - 1)}
                className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Previous
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-400">
                Previous
              </span>
            )}
            <span className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700">
              Page {meta.page} of {meta.totalPages}
            </span>
            {meta.page < meta.totalPages ? (
              <Link
                href={buildPageHref(meta.page + 1)}
                className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Next
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-400">
                Next
              </span>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}

