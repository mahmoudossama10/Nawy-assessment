import type { Apartment, ApartmentListResponse } from '@/types/apartment';

const API_BASE_URL =
  typeof window === 'undefined'
    ? process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? 'http://localhost:4000';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export interface ApartmentSearchParams {
  search?: string;
  project?: string;
  page?: number;
  pageSize?: number;
}

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

export const fetchApartment = async (id: string): Promise<Apartment> => {
  const url = new URL(`/api/apartments/${id}`, API_BASE_URL);
  const response = await fetch(url.toString(), { cache: 'no-store' });
  return handleResponse<Apartment>(response);
};

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

export const fetchProjects = async (): Promise<string[]> => {
  const url = new URL('/api/apartments/projects', API_BASE_URL);
  const response = await fetch(url.toString(), { cache: 'no-store' });
  return handleResponse<string[]>(response);
};

