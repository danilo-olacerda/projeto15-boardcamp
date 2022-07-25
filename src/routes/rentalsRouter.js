import { Router } from "express";
import { getRentals, createRental, returnRental, deleteRental } from "../controllers/rentalsController.js";
import validateRental from "../middlewares/validateRental.js";
import validateRentalReturn from "../middlewares/validateRentalReturn.js";

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', validateRental, createRental);
router.post('/rentals/:id/return', validateRentalReturn, returnRental);
router.delete('/rentals/:id', deleteRental);
router.get('/rentals?customerId', getRentals);

export default router;