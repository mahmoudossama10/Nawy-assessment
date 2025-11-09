/**
 * Detail view for individual apartment listings. This is a Server Component that:
 * - Provides SEO-optimized metadata through Next.js generateMetadata
 * - Handles data fetching at the edge through server-side rendering
 * - Integrates with the 404 system for missing/invalid IDs
 * 
 * Design decisions:
 * - Server Component: Chosen for SEO and initial page load performance
 * - Error boundary integration: Uses Next.js notFound() for clean 404 handling
 * - SafeImage usage: Maintains visual stability during image loading/errors
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchApartment } from '@/lib/api';
import SafeImage from '@/components/SafeImage';

interface ApartmentPageProps {
  params: { id: string };
}

/**
 * Generates dynamic metadata for SEO optimization.
 * This function runs at the edge, enabling search engines to index
 * individual apartment pages with their specific details.
 * 
 * Falls back to a generic title on errors to maintain SEO presence
 * even when the apartment isn't found or data is unavailable.
 */
export async function generateMetadata({ params }: ApartmentPageProps) {
  const { id } = params;
  try {
    const apartment = await fetchApartment(id);
    return {
      title: apartment.name,
      description: apartment.description
    };
  } catch (error) {
    console.error(error);
    return {
      title: 'Apartment not found'
    };
  }
}

/**
 * Currency formatter shared with ApartmentCard component
 * Using USD for demo purposes - in production, this would:
 * 1. Pull currency from apartment data or user preferences
 * 2. Use a shared utility for consistent formatting
 * 3. Consider exchange rates and localization
 */
function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Server Component for apartment detail pages.
 * 
 * Architecture highlights:
 * - Server-side data fetching eliminates waterfalls and reduces client JS
 * - Integration with SafeImage for resilient image loading
 * - Graceful degradation with fallback UI patterns
 * - SEO-friendly markup structure with semantic HTML
 * 
 * Related components:
 * - Works with ApartmentCard from the listing page for consistent styling
 * - Shares image loading strategy with SafeImage component
 * - Uses the same API client as the main listing page
 */
export default async function ApartmentPage({ params }: ApartmentPageProps) {
  const { id } = params;
  try {
    const apartment = await fetchApartment(id);

    // Structure follows a logical content hierarchy for SEO and accessibility
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-0">
        {/* Navigation pattern consistent with the main listing page */}
        <Link href="/" className="text-sm text-brand-600 transition hover:text-brand-700">
          ← Back to listings
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
          {/* Image section with smart loading and fallback strategies */}
          <div className="relative h-80 w-full bg-slate-100 sm:h-96">
            {apartment.images?.[0] ? (
              <SafeImage
                src={apartment.images[0]}
                alt={`${apartment.name} image`}
                fill
                className="object-cover"
                priority // Important: Prioritizes LCP for core web vitals
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700">
                    <span className="text-2xl font-semibold">{apartment.name}</span>
                  </div>
                }
              />
            ) : (
              // Identical fallback ensures consistent UI whether image is missing or loading
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700">
                <span className="text-2xl font-semibold">{apartment.name}</span>
              </div>
            )}
            {/* Floating info badge - styled for readability on any background */}
            <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow">
              <span className="rounded-full bg-brand-100 px-2 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">{apartment.project}</span>
              <span>Unit {apartment.unitNumber}</span>
            </div>
          </div>

          {/* Main content area with responsive layout system */}
          <div className="flex flex-col gap-6 p-8">
            {/* Header section combines title and price for prominent display
                Responsive layout switches between column and row based on breakpoint */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">{apartment.name}</h1>
                <p className="text-sm text-slate-500">
                  {apartment.address}, {apartment.city}, {apartment.country}
                </p>
              </div>
              {/* Price card uses brand colors for emphasis
                  Matches styling from ApartmentCard for consistency */}
              <div className="rounded-2xl bg-brand-50 px-6 py-3 text-right">
                <p className="text-sm text-brand-500">Listing price</p>
                <p className="text-2xl font-bold text-brand-700">{formatCurrency(apartment.price)}</p>
              </div>
            </div>

            {/* Key features grid - adapts columns based on screen size
                Uses consistent card styling for visual rhythm */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 p-4 text-center">
                <p className="text-sm text-slate-500">Bedrooms</p>
                <p className="text-xl font-semibold text-slate-900">{apartment.bedrooms}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 text-center">
                <p className="text-sm text-slate-500">Bathrooms</p>
                <p className="text-xl font-semibold text-slate-900">{apartment.bathrooms}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 text-center">
                <p className="text-sm text-slate-500">Area</p>
                <p className="text-xl font-semibold text-slate-900">{apartment.area} sqm</p>
              </div>
              {/* Date formatting matches the listing page for consistency */}
              <div className="rounded-2xl border border-slate-200 p-4 text-center">
                <p className="text-sm text-slate-500">Updated</p>
                <p className="text-xl font-semibold text-slate-900">
                  {new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium'
                  }).format(new Date(apartment.updatedAt))}
                </p>
              </div>
            </div>

            {/* Main content section with sidebar layout
                Uses CSS Grid with custom fractional columns for optimal content distribution */}
            <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              {/* Primary content area with description and amenities */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
                <p className="text-slate-600 leading-relaxed">{apartment.description}</p>

                {/* Conditional rendering of amenities section
                    Uses pill-style tags for visual distinction */}
                {apartment.amenities.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {apartment.amenities.map((amenity) => (
                        <span key={amenity} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact sidebar - fixed width on desktop, full width on mobile
                  Elevated visual treatment to draw attention */}
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Interested in this unit?</h3>
                <p className="text-sm text-slate-600">
                  Reach out to our team for private showings, availability updates, and tailored financing options.
                </p>
                <a
                  href="mailto:dev.hiring@nawy.com"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Contact us
                </a>
                {/* Listing ID displayed for reference and support purposes */}
                <p className="text-xs text-slate-400">
                  Listing ID: <span className="font-medium text-slate-500">{apartment.id}</span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Forward to Next.js 404 page while preserving error for monitoring
    console.error(error);
    notFound();
  }
}

