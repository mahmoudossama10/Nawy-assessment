/**
 * Apartment Controller Module
 * 
 * Architecture & Design Decisions:
 * 1. Layered Architecture:
 *    - Controllers handle HTTP concerns (request/response)
 *    - Business logic delegated to service layer
 *    - Clear separation of validation, error handling, and data flow
 * 
 * 2. Validation Strategy:
 *    - Uses Zod schemas for type-safe request validation
 *    - Validation happens before business logic
 *    - Consistent error response format
 * 
 * 3. Error Handling Pattern:
 *    - Centralized error handling through next(error)
 *    - Special handling for HttpError with specific status codes
 *    - Preserves stack traces for debugging
 * 
 * 4. Response Patterns:
 *    - Consistent JSON response format
 *    - Proper HTTP status codes (200, 201, 400, 404, etc.)
 *    - Early returns for validation/error cases
 */

import { Request, Response, NextFunction } from 'express';
import * as apartmentService from '../services/apartmentService';
import { HttpError } from '../errors/HttpError';
import {
  createApartmentSchema,
  listApartmentQuerySchema
} from '../validators/apartmentValidators';

/**
 * Lists apartments with optional filtering and pagination.
 * 
 * Architecture Notes:
 * - Uses Zod for query parameter validation
 * - Handles both validation and service errors differently
 * - Returns paginated response for performance
 */
export const listApartments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = listApartmentQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten() });
      return;
    }

    const result = await apartmentService.listApartments(parsed.data);
    res.json(result);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

/**
 * Lists unique project names for filtering.
 * 
 * Architecture Notes:
 * - Simple pass-through to service layer
 * - No validation needed (no request parameters)
 * - Used by frontend for filter dropdown
 * - Memory efficient (returns string[] vs full objects)
 */
export const listProjects = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await apartmentService.listProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves detailed information for a single apartment.
 * 
 * Architecture Notes:
 * - Basic parameter validation without Zod (simple string check)
 * - Explicit 404 handling for better UX
 * - Early returns for validation/not found cases
 */
export const getApartmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Apartment id is required' });
      return;
    }

    const apartment = await apartmentService.getApartmentById(id);
    if (!apartment) {
      res.status(404).json({ message: 'Apartment not found' });
      return;
    }

    res.json(apartment);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new apartment listing.
 * 
 * Architecture Notes:
 * 1. Input Validation:
 *    - Uses Zod schema for comprehensive validation
 *    - Returns detailed validation errors
 *    - Type-safe parsed data passed to service
 * 
 * 2. Response Handling:
 *    - Returns 201 Created for successful creation
 *    - Includes created entity in response (useful for immediate UI updates)
 *    - Preserves validation error structure from Zod
 * 
 * 3. Error Delegation:
 *    - Validation errors handled directly
 *    - Business logic errors delegated to error middleware
 */
export const createApartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createApartmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten() });
      return;
    }

    const created = await apartmentService.createApartment(parsed.data);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

