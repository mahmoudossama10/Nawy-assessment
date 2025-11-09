/**
 * Root layout component that provides the application shell.
 * As a Server Component, it's part of Next.js's advanced routing system:
 * - Renders once on the server, shared across all pages
 * - Enables consistent SEO through metadata templates
 * - Provides global styles and layout structure
 * 
 * The layout maintains a consistent header/footer while allowing
 * dynamic content injection through the children prop. This pattern
 * preserves state during client-side navigation.
 */

import type { Metadata } from 'next';
import './globals.css';

// Template-based metadata system allows child pages to extend these defaults
// The %s template enables dynamic titles while maintaining brand consistency
export const metadata: Metadata = {
  title: {
    default: 'Nawy Apartments',
    template: '%s | Nawy Apartments'
  },
  description: 'Discover and explore apartments with detailed insights and amenities.'
};

// Root layout wraps every page in the application
// It's a Server Component by default - no "use client" needed
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Base styles ensure full-height layout and consistent background */}
      <body className="min-h-screen bg-slate-50">
        {/* Flex container enables sticky footer pattern */}
        <div className="min-h-screen flex flex-col">
          {/* Semi-transparent header with blur effect for depth
              Maintains readability while scrolling content underneath */}
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
              {/* Brand identity section using consistent spacing and color tokens */}
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
          {/* Main content area expands to fill available space
              This ensures footer stays at bottom even with short content */}
          <main className="flex-1">{children}</main>
          {/* Semi-transparent footer matches header aesthetic
              Uses dynamic year to stay current without rebuilds */}
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

