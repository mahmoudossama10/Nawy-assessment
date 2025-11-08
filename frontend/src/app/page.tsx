
import ApartmentsClient from './ApartmentsClient';

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


export default function HomePage() {
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
      <ApartmentsClient />
    </div>
  );
}

