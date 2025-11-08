"use client";

import React from 'react';
import type { Apartment } from '@/types/apartment';
import ApartmentCard from './ApartmentCard';

interface ApartmentGridProps {
  items: Apartment[];
}

function ApartmentGrid({ items }: ApartmentGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((apartment) => (
        <ApartmentCard key={apartment.id} apartment={apartment} />
      ))}
    </div>
  );
}

export default React.memo(ApartmentGrid, (prev, next) => {
  if (prev.items.length !== next.items.length) return false;
  for (let i = 0; i < prev.items.length; i++) {
    if (prev.items[i].id !== next.items[i].id) return false;
    if (prev.items[i].updatedAt !== next.items[i].updatedAt) return false;
  }
  return true;
});
