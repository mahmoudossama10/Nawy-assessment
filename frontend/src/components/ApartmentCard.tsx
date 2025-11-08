import Link from 'next/link';
import React from 'react';
import type { Apartment } from '@/types/apartment';
import SafeImage from './SafeImage';

interface ApartmentCardProps {
  apartment: Apartment;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function ApartmentCard({ apartment }: ApartmentCardProps) {
  const image = apartment.images?.[0];
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
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            fallback={imageFallback}
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

export default React.memo(ApartmentCard);

