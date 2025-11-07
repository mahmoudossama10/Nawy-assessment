export interface Apartment {
  id: string;
  name: string;
  unitNumber: string;
  project: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  area: number;
  address: string;
  city: string;
  country: string;
  description: string;
  images: string[];
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApartmentListResponse {
  items: Apartment[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

