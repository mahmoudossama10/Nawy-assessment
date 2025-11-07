import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl text-brand-600">🏙️</div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">We couldn’t find that apartment</h1>
        <p className="text-slate-600">
          The listing might be unavailable or has been moved. Explore other apartments to keep searching for your next home.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Return to listings
      </Link>
    </div>
  );
}

