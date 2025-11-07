import { z } from 'zod';

export const createApartmentSchema = z.object({
  name: z.string().min(1),
  unitNumber: z.string().min(1),
  project: z.string().min(1),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  price: z.number().nonnegative(),
  area: z.number().positive(),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  description: z.string().min(1),
  images: z.array(z.string().url()).optional().default([]),
  amenities: z.array(z.string().min(1)).optional().default([])
});

export const listApartmentQuerySchema = z.object({
  search: z.string().optional(),
  project: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10)
});

export type CreateApartmentInput = z.infer<typeof createApartmentSchema>;
export type ListApartmentQuery = z.infer<typeof listApartmentQuerySchema>;

