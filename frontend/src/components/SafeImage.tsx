'use client';

import Image, { type ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

type SafeImageProps = ImageProps & {
  fallback?: React.ReactNode;
  retryCount?: number;
};

export default function SafeImage({ fallback, onError, alt, src, retryCount = 2, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retries, setRetries] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
    setRetries(0);
  }, [src]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (retries < retryCount) {
      setTimeout(() => {
        setRetries((prev) => prev + 1);
        setCurrentSrc(`${src}?retry=${retries + 1}&t=${Date.now()}`);
        setIsLoading(true);
      }, 1000 * (retries + 1));
    } else {
      setHasError(true);
      setIsLoading(false);
      onError?.(event);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return fallback ? <>{fallback}</> : (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
        Image unavailable
      </div>
    );
  }

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

