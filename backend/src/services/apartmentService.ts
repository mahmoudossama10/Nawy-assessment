import type { Apartment } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import type { CreateApartmentInput, ListApartmentQuery } from '../validators/apartmentValidators';

const serializeApartment = (apartment: Apartment) => ({
  ...apartment,
  price: apartment.price.toNumber()
});

export const listApartments = async (filters: ListApartmentQuery) => {
  const { search, project, page, pageSize } = filters;

  const where: Prisma.ApartmentWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { unitNumber: { contains: search, mode: 'insensitive' } },
      { project: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (project) {
    where.project = { contains: project, mode: 'insensitive' };
  }

  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.apartment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize
    }),
    prisma.apartment.count({ where })
  ]);

  return {
    items: items.map(serializeApartment),
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};

export const getApartmentById = async (id: string) => {
  const apartment = await prisma.apartment.findUnique({ where: { id } });
  return apartment ? serializeApartment(apartment) : null;
};

export const createApartment = async (input: CreateApartmentInput) => {
  const apartment = await prisma.apartment.create({
    data: {
      ...input,
      price: new Prisma.Decimal(input.price)
    }
  });
  return serializeApartment(apartment);
};

