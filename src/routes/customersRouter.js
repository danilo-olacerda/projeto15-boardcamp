import { Router } from "express";
import { getCustomers, createCustomer, updateCustomer} from "../controllers/customersController.js";
import validateCustomer from "../middlewares/validateCustomer.js";

const router = Router();

router.get('/customers?cpf', getCustomers);
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomers);
router.post('/customers', validateCustomer, createCustomer);
router.put('/customers/:id', validateCustomer, updateCustomer);

export default router;