import { Request, Response, NextFunction } from 'express';
import * as apartmentService from '../services/apartmentService';
import {
  createApartmentSchema,
  listApartmentQuerySchema
} from '../validators/apartmentValidators';

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
    next(error);
  }
};

export const listProjects = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await apartmentService.listProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

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

