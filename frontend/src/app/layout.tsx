import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Nawy Apartments',
    template: '%s | Nawy Apartments'
  },
  description: 'Discover and explore apartments with detailed insights and amenities.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-brand-100 p-2 text-brand-600 shadow-sm">🏠</span>
                <div>
                  <p className="text-lg font-semibold text-slate-900">Nawy Apartments</p>
                  <p className="text-sm text-slate-500">Find your next home effortlessly</p>
                </div>
              </div>
              <a
                href="https://www.nawy.com"
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50 sm:block"
              >
                Visit Nawy
              </a>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white/60">
            <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-slate-500">
              © {new Date().getFullYear()} Nawy Apartments. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

