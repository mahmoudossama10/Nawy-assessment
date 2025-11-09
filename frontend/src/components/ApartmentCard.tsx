import Link from 'next/link';
import React from 'react';
import type { Apartment } from '@/types/apartment';
import SafeImage from './SafeImage';

/**
 * ApartmentCard
 *  - Small, focused presentational component used by the listing grid.
 *  - Rendered many times on the listing page, so we optimize for render cost
  *    and stable props (hence the React.memo export at the bottom).
  *  - Keeps markup semantic (article, h3, etc...) so the page remains accessible and
  *    SEO-friendly even when JavaScript is disabled.
  *
  * Integration notes:
  *  - Shares visual language with the apartment details page (detail view)
  *    so users see familiar information when they drill into a listing.
  *  - Uses `SafeImage` for resilient image loading and to centralize image
  *    retry/fallback logic used across the app.
  */

interface ApartmentCardProps {
  apartment: Apartment;
}

// Intl.NumberFormat is expensive to construct; create it once at module
// initialization and reuse across component instances. In a multi-locale
// application this would live in a shared i18n utility and respect user
// preferences or apartment-specific currency fields.
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  // Thin wrapper keeps templates below readable and centralizes formatting
  return currencyFormatter.format(value);
}

function ApartmentCard({ apartment }: ApartmentCardProps) {
  const image = apartment.images?.[0];

  // Fallback UI for when images are missing or fail to load. We keep this
  // simple and visually consistent with the rest of the app so cards remain
  // stable in size (avoids layout shifts) and still convey the apartment name.
  const imageFallback = (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700">
      <span className="text-xl font-semibold">{apartment.name}</span>
    </div>
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-56 w-full bg-slate-100">
        {image ? (
          <SafeImage
            src={image}
            alt={`${apartment.name} image`}
            fill
            // sizes hint helps the browser pick the right image size for device
            // widths. These values balance quality and bandwidth for common
            // breakpoints used by the app layout.
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            // Provide a fallback DOM node while SafeImage manages retries and
            // low-level errors. This keeps the visual layout identical whether
            // an image loads or not.
            fallback={imageFallback}
            // Card images are not critical LCP elements; set priority=false to
            // avoid starving the detail page or hero images. If a different
            // image should be prioritized, set priority={true} in that context.
            priority={false}
          />
        ) : (
          imageFallback
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow">{apartment.project}</span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{apartment.name}</h3>
            <p className="text-sm text-slate-500">Unit {apartment.unitNumber}</p>
          </div>
          <p className="text-right text-lg font-semibold text-brand-600">{formatCurrency(apartment.price)}</p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">{apartment.bedrooms} Beds</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{apartment.bathrooms} Baths</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{apartment.area} sqm</span>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{apartment.description}</p>

        {/*
          Footer row:
          - Location text provides quick geographic context for the user and
          - The Link navigates to the server-rendered detail page at
            `/apartments/[id]` which is implemented as a Server Component.
          This Link intentionally uses a client-side navigation to avoid a
          full page refresh while preserving server-rendered content on the
          destination page for SEO.
        */}
        <div className="mt-auto flex items-center justify-between text-sm text-slate-500">
          <span>
            {apartment.city}, {apartment.country}
          </span>
          <Link
            href={`/apartments/${apartment.id}`}
            className="font-medium text-brand-600 transition hover:text-brand-700"
          >
            View details →
          </Link>
        </div>
      </div>
    </article>
  );
}

// Wrap with React.memo because this component is used repeatedly in lists.
// The parent (ApartmentGrid) also memoizes its item array, so memoization
// here prevents re-render churn when unrelated state changes elsewhere in
// the page. If apartments have frequently changing nested props, consider
// supplying a stable key or a custom comparator.
export default React.memo(ApartmentCard);

