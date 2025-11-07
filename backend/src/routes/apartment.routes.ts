import { Router } from 'express';
import * as apartmentController from '../controllers/apartmentController';

const router = Router();

router.get('/', apartmentController.listApartments);
router.get('/:id', apartmentController.getApartmentById);
router.post('/', apartmentController.createApartment);

export default router;

