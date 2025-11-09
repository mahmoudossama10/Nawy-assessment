"use client"; // This component uses browser-only APIs (events, state) so mark it as a client component.

import React from 'react';
import type { Apartment } from '@/types/apartment';
import ApartmentCard from './ApartmentCard';

/**
 * ApartmentGrid
 * - Thin presentational wrapper used by the listing page (ApartmentsClient).
 * - Responsible for layout only; delegates rendering of individual items
 *   to `ApartmentCard` which contains image/fallback/formatting logic.
 * - Kept intentionally simple so we can memoize the entire grid and avoid
 *   re-rendering large lists when unrelated parent state changes.
 *
 * Layout and responsiveness:
 * - Uses a small CSS grid with breakpoints tuned to the app's layout.
 * - The grid slot sizing is chosen to match the card sizes and the
 *   `sizes` hints provided to images in `ApartmentCard` so the browser
 *   can choose appropriate image sources.
 *
 * Performance rationale:
 * - This component is wrapped with `React.memo` and a custom comparator
 *   (below) to avoid re-render churn when the array reference changes but
 *   the visible items are identical. The comparator checks `id` and
 *   `updatedAt` because those are sufficient to detect meaningful changes
 *   for the UI (title, price, and images). Avoiding a deep compare keeps
 *   the check cheap.
 */
interface ApartmentGridProps {
  items: Apartment[];
}

function ApartmentGrid({ items }: ApartmentGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((apartment) => (
        // key must be stable and unique to allow React to preserve DOM nodes
        <ApartmentCard key={apartment.id} apartment={apartment} />
      ))}
    </div>
  );
}

/**
 * Custom memo comparator for ApartmentGrid.
 *
 * Why a custom comparator?
 * - The parent (`ApartmentsClient`) may recreate the `items` array during
 *   paging or revalidation even if the visible items haven't changed.
 * - A shallow prop compare would treat a new array reference as changed and
 *   force a re-render of many cards. Instead we do a small, fast check:
 *   1) compare lengths (fast reject)
 *   2) compare item ids and updatedAt timestamps to detect meaningful
 *      changes (cheap string comparisons)
 *
 * This approach favors the common-case where lists are stable between
 * revalidations (SWR `keepPreviousData`) and yields noticeably fewer
 * renders on filter/pagination transitions.
 */
export default React.memo(ApartmentGrid, (prev, next) => {
  if (prev.items.length !== next.items.length) return false;
  for (let i = 0; i < prev.items.length; i++) {
    if (prev.items[i].id !== next.items[i].id) return false;
    if (prev.items[i].updatedAt !== next.items[i].updatedAt) return false;
  }
  return true;
});
