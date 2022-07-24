import { Router } from "express";
import { getCategories, createCategories } from "../controllers/categoriesController.js";
import validateCategorie from "../middlewares/validateCategorie.js";

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', validateCategorie, createCategories);

export default router;