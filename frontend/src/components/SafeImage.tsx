'use client';

import Image, { type ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

/**
 * SafeImage
 *
 * A small, resilient image wrapper used across the listing and detail pages.
 * It centralizes common patterns we need for robust image UX:
 * - Retry logic for transient network/image CDN failures
 * - Visual loading state to avoid layout shifts and improve perceived performance
 * - A developer-provided `fallback` node so each caller can control the fallback UI
 *
 * Reasons for this component:
 * - The app displays many remote images; rather than duplicating retry/fallback
 *   logic in multiple places we keep it here for maintainability and consistent UX.
 * - Using `next/image` inside a client component enables us to hook browser
 *   events (onError/onLoad) while still benefiting from Next.js optimizations
 *   during builds/production.
 */
type SafeImageProps = ImageProps & {
  // Rendered when the image fails to load after retries. Callers supply
  // a domain-appropriate fallback (e.g., the apartment name card or icon).
  fallback?: React.ReactNode;
  // Number of retry attempts before giving up. Kept small to avoid
  // long waits and to surface persistent errors quickly.
  retryCount?: number;
};

export default function SafeImage({ fallback, onError, alt, src, retryCount = 2, ...props }: SafeImageProps) {
  // Component state keeps track of transient image conditions.
  // - hasError: final failure state after exhausting retries
  // - isLoading: whether we should show the skeleton/loading indicator
  // - retries: how many retry attempts we've done so far
  // - currentSrc: the actual src passed to <Image />; we append a cache-busting
  //   query when retrying to force the browser/edge to fetch again
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retries, setRetries] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Reset internal state when the src prop changes. This allows the same
  // SafeImage instance to be reused when the parent switches images.
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
    setRetries(0);
  }, [src]);

  /**
   * onError handler with exponential backoff-like retry delays.
   * - We only retry a small number of times to avoid blocking the UI.
   * - Each retry appends a cache-busting query param so CDNs/browsers will
   *   treat it as a fresh fetch (useful for transient 502/504 or stale CDN).
   * - After retries are exhausted we call the optional upstream onError so
   *   analytics/monitoring can record the failure.
   */
  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (retries < retryCount) {
      // Stagger retries to give transient systems time to recover
      setTimeout(() => {
        setRetries((prev) => prev + 1);
        // Attach retry and timestamp to help bypass caches when necessary
        setCurrentSrc(`${src}?retry=${retries + 1}&t=${Date.now()}`);
        setIsLoading(true);
      }, 1000 * (retries + 1));
    } else {
      // Final failure: surface fallback and notify upstream
      setHasError(true);
      setIsLoading(false);
      onError?.(event);
    }
  };

  const handleLoad = () => {
    // Successful load: hide the spinner and reveal the image
    setIsLoading(false);
  };

  // If the image failed after retries, render the caller-provided fallback
  // (keeps the caller in control of the visual style) or a sensible default.
  if (hasError) {
    return fallback ? <>{fallback}</> : (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
        Image unavailable
      </div>
    );
  }

  // Container maintains layout so the surrounding cards/sections don't shift.
  // We render a simple spinner while loading to improve perceived performance.
  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        </div>
      )}
      <Image
        alt={alt}
        src={currentSrc}
        {...props}
        onError={handleError}
        onLoad={handleLoad}
        className={`${props.className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
}

