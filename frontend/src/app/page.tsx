
import ApartmentsClient from './ApartmentsClient';

/**
 * Home page component that serves as the application's entry point.
 * Architectural decisions:
 * - Server Component for optimal SEO and initial page load
 * - Defers interactive features to ApartmentsClient for selective hydration
 * - Uses force-dynamic to ensure fresh data on each request
 * 
 * This implements the "Shell & Core" pattern where:
 * - Page (shell) - Static, SEO-friendly content rendered on server
 * - ApartmentsClient (core) - Rich interactive features on client
 */

// Ensures Next.js treats this as a dynamic route
// Critical for real-time inventory and pricing updates
export const dynamic = 'force-dynamic';

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

