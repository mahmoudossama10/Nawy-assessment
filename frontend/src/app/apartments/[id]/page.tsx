import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchApartment } from '@/lib/api';
import SafeImage from '@/components/SafeImage';

interface ApartmentPageProps {
  params: { id: string };
}

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

export default async function ApartmentPage({ params }: ApartmentPageProps) {
  const { id } = params;
  try {
    const apartment = await fetchApartment(id);

    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-0">
        <Link href="/" className="text-sm text-brand-600 transition hover:text-brand-700">
          ← Back to listings
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
          <div className="relative h-80 w-full bg-slate-100 sm:h-96">
            {apartment.images?.[0] ? (
              <SafeImage
                src={apartment.images[0]}
                alt={`${apartment.name} image`}
                fill
                className="object-cover"
                priority
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700">
                    <span className="text-2xl font-semibold">{apartment.name}</span>
                  </div>
                }
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700">
                <span className="text-2xl font-semibold">{apartment.name}</span>
              </div>
            )}
            <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow">
              <span className="rounded-full bg-brand-100 px-2 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">{apartment.project}</span>
              <span>Unit {apartment.unitNumber}</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">{apartment.name}</h1>
                <p className="text-sm text-slate-500">
                  {apartment.address}, {apartment.city}, {apartment.country}
                </p>
              </div>
              <div className="rounded-2xl bg-brand-50 px-6 py-3 text-right">
                <p className="text-sm text-brand-500">Listing price</p>
                <p className="text-2xl font-bold text-brand-700">{formatCurrency(apartment.price)}</p>
              </div>
            </div>

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
              <div className="rounded-2xl border border-slate-200 p-4 text-center">
                <p className="text-sm text-slate-500">Updated</p>
                <p className="text-xl font-semibold text-slate-900">
                  {new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium'
                  }).format(new Date(apartment.updatedAt))}
                </p>
              </div>
            </div>

            <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
                <p className="text-slate-600 leading-relaxed">{apartment.description}</p>

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
    console.error(error);
    notFound();
  }
}

