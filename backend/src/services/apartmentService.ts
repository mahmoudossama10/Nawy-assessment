/**
 * Apartment Service Module
 * 
 * Architecture & Design Decisions:
 * 1. Data Access Layer:
 *    - Prisma ORM for type-safe database operations
 *    - Centralized data access patterns
 *    - Repository pattern for data operations
 * 
 * 2. Business Logic Layer:
 *    - Domain-specific validation rules
 *    - Complex query construction
 *    - Data transformation and serialization
 * 
 * 3. Error Handling Strategy:
 *    - Domain-specific errors (HttpError)
 *    - Business rule validation
 *    - Conflict detection (duplicate prevention)
 * 
 * 4. Performance Optimization:
 *    - Parallel queries where possible
 *    - Efficient filtering and pagination
 *    - Minimal database roundtrips
 */

import type { Apartment } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { HttpError } from '../errors/HttpError';
import { prisma } from '../lib/prisma';
import type { CreateApartmentInput, ListApartmentQuery } from '../validators/apartmentValidators';

/**
 * Serializes an Apartment entity for API responses.
 * 
 * Architecture Notes:
 * - Converts Prisma.Decimal to number for JSON compatibility
 * - Maintains consistent data format across API
 * - Isolates database types from API contract
 */
const serializeApartment = (apartment: Apartment) => ({
  ...apartment,
  price: apartment.price.toNumber()
});

/**
 * Lists apartments with filtering and pagination support.
 * 
 * Architecture Notes:
 * 1. Query Construction:
 *    - Dynamic where clause building
 *    - Case-insensitive search across multiple fields
 *    - Composable filter conditions
 * 
 * 2. Performance Optimizations:
 *    - Parallel execution of count and data queries
 *    - Efficient pagination using skip/take
 *    - Index-friendly search patterns
 * 
 * 3. Response Structure:
 *    - Consistent metadata format
 *    - Serialized data for API compatibility
 *    - Calculated pagination information
 */
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

  // Parallel queries for optimal performance
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

/**
 * Lists all unique project names from apartments.
 * 
 * Architecture Notes:
 * 1. Query Optimization:
 *    - Minimal field selection (project only)
 *    - In-memory deduplication
 *    - Null filtering for data integrity
 * 
 * 2. Sort Strategy:
 *    - Alphabetical sorting for consistent UI display
 *    - Improves UX in dropdown menus
 */
export const listProjects = async () => {
  // Fetch all apartments but only select the project field, then dedupe
  const projects = await prisma.apartment.findMany({
    select: { project: true }
  });

  const unique = Array.from(new Set(projects.map((p: { project: string | null }) => p.project))).filter(
    Boolean
  ) as string[];
  return unique.sort();
};

/**
 * Retrieves a single apartment by ID.
 * 
 * Architecture Notes:
 * 1. Data Access:
 *    - Uses findUnique for primary key lookup
 *    - Leverages database indexing
 * 
 * 2. Response Handling:
 *    - Returns null for not found (vs throwing)
 *    - Consistent serialization
 *    - Allows controller to determine HTTP status
 */
export const getApartmentById = async (id: string) => {
  const apartment = await prisma.apartment.findUnique({ where: { id } });
  return apartment ? serializeApartment(apartment) : null;
};

/**
 * Creates a new apartment listing.
 * 
 * Architecture Notes:
 * 1. Business Rules:
 *    - Enforces unique unit numbers within projects
 *    - Case-insensitive duplicate detection
 *    - Proper error classification (409 Conflict)
 * 
 * 2. Data Integrity:
 *    - Price stored as Decimal for precision
 *    - Consistent case handling
 *    - Input validation at service layer
 * 
 * 3. Transaction Pattern:
 *    - Check-then-act pattern
 *    - Potential race condition accepted for simplicity
 *    - Could add transaction if strong consistency needed
 * 
 * 4. Error Handling:
 *    - Domain-specific error types
 *    - Clear error messages
 *    - Proper status code selection
 */
export const createApartment = async (input: CreateApartmentInput) => {
  // Prevent creating duplicate apartments with same unitNumber within the same project
  const existing = await prisma.apartment.findFirst({
    where: {
      unitNumber: { equals: input.unitNumber, mode: 'insensitive' },
      project: { equals: input.project, mode: 'insensitive' }
    }
  });

  if (existing) {
    throw new HttpError(409, 'Apartment with the same unit number already exists in this project');
  }

  const apartment = await prisma.apartment.create({
    data: {
      ...input,
      price: new Prisma.Decimal(input.price)
    }
  });
  return serializeApartment(apartment);
};

