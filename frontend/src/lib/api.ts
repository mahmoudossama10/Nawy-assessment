/**
 * API client module for the apartments application.
 * 
 * Architecture & Design Decisions:
 * 1. Isomorphic Configuration:
 *    - Handles both server-side and client-side API calls
 *    - Uses different environment variables based on runtime context
 *    - Graceful fallback to localhost for development
 * 
 * 2. Error Handling Strategy:
 *    - Centralized error handling through handleResponse utility
 *    - Preserves original error messages from the API
 *    - Type-safe responses using TypeScript generics
 * 
 * 3. Caching Strategy:
 *    - Uses { cache: 'no-store' } to ensure real-time data
 *    - Prevents stale data in dynamic apartment listings
 *    - Allows Next.js to optimize SSR/ISR if needed
 */

import type { Apartment, ApartmentListResponse } from '@/types/apartment';

/**
 * Dynamic API base URL configuration that handles both server and client environments.
 * Priority order:
 * Server: API_BASE_URL → NEXT_PUBLIC_API_BASE_URL → localhost
 * Client: NEXT_PUBLIC_API_BASE_URL → API_BASE_URL → localhost
 */
const API_BASE_URL =
  typeof window === 'undefined'
    ? process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? 'http://localhost:4000';

/**
 * Generic response handler that provides consistent error handling and type safety.
 * 
 * @template T - The expected response data type
 * @throws {Error} With the API's error message or a fallback status message
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
};

/**
 * Search parameters interface for apartment listing filters.
 * All parameters are optional to support partial filtering.
 */
export interface ApartmentSearchParams {
  /** Full-text search across apartment name, number, and description */
  search?: string;
  /** Filter by specific project name */
  project?: string;
  /** Pagination: Current page number (1-based) */
  page?: number;
  /** Pagination: Number of items per page */
  pageSize?: number;
}

/**
 * Fetches a paginated list of apartments with optional filtering.
 * 
 * Architecture Notes:
 * 1. URL Parameter Handling:
 *    - Cleanly handles undefined/null/empty values
 *    - Prevents unnecessary query parameters
 *    - Maintains clean URLs for SEO and sharing
 * 
 * 2. Cache Strategy:
 *    - Uses no-store to ensure real-time availability data
 *    - Critical for accurate pricing and availability
 * 
 * @param params - Optional search and pagination parameters
 * @returns Promise with paginated apartment list and metadata
 */
export const fetchApartments = async (params: ApartmentSearchParams = {}): Promise<ApartmentListResponse> => {
  const url = new URL('/api/apartments', API_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), { cache: 'no-store' });
  return handleResponse<ApartmentListResponse>(response);
};

/**
 * Fetches detailed information for a single apartment.
 * Uses no-store caching to ensure up-to-date pricing and availability,
 * critical for the real estate domain where stale data could lead
 * to customer dissatisfaction.
 * 
 * @param id - Unique identifier of the apartment
 */
export const fetchApartment = async (id: string): Promise<Apartment> => {
  const url = new URL(`/api/apartments/${id}`, API_BASE_URL);
  const response = await fetch(url.toString(), { cache: 'no-store' });
  return handleResponse<Apartment>(response);
};

/**
 * Creates a new apartment listing.
 * 
 * Architecture Notes:
 * 1. Partial<Apartment>:
 *    - Allows for flexible payload structure
 *    - Server handles default values and validation
 *    - Supports draft/incomplete listings
 * 
 * 2. Content-Type:
 *    - Explicit JSON content type for API consistency
 *    - Helps with server-side content negotiation
 * 
 * @param payload - Partial apartment data, allowing for flexible creation
 */
export const createApartment = async (payload: Partial<Apartment>) => {
  const response = await fetch(new URL('/api/apartments', API_BASE_URL).toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  return handleResponse<Apartment>(response);
};

/**
 * Fetches a unique list of project names for filtering.
 * 
 * Architecture Notes:
 * - No-store cache ensures new projects appear immediately
 * - Returns string[] for memory efficiency (vs full project objects)
 * - Used by SearchFilters component for project dropdown
 */
export const fetchProjects = async (): Promise<string[]> => {
  const url = new URL('/api/apartments/projects', API_BASE_URL);
  const response = await fetch(url.toString(), { cache: 'no-store' });
  return handleResponse<string[]>(response);
};

