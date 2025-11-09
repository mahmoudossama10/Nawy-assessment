/**
 * Apartment Routes Module
 * 
 * Architecture & Design Decisions:
 * 1. Route Organization:
 *    - Resource-based routing (/apartments as base path)
 *    - RESTful endpoint design
 *    - Logical grouping of related operations
 * 
 * 2. Route Order:
 *    - Static routes before dynamic routes
 *    - /projects before /:id to prevent path conflicts
 *    - Prevents /projects being interpreted as an :id parameter
 * 
 * 3. HTTP Methods:
 *    - GET for retrieval operations (listing, details)
 *    - POST for creation
 *    - Follows REST conventions for predictable API behavior
 * 
 * 4. Middleware Architecture:
 *    - Routes map directly to controller methods
 *    - No route-specific middleware (handled at app level)
 *    - Keeps routing layer thin and maintainable
 */

import { Router } from 'express';
import * as apartmentController from '../controllers/apartmentController';

const router = Router();

// List operations (static routes first)
router.get('/', apartmentController.listApartments);
router.get('/projects', apartmentController.listProjects);

// Individual apartment operations (dynamic routes last)
router.get('/:id', apartmentController.getApartmentById);
router.post('/', apartmentController.createApartment);

export default router;

