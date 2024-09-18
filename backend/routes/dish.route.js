import { Router } from "express";
import { createDish, getAllDishes, deleteDish, getMenuItemsFromSheets } from "../controllers/dish.controller.js";
import { verifyJWT } from "../middlewares/counsellorAuth.middleware.js";

const router = Router();

router.get("/", verifyJWT, getAllDishes);
router.post("/", verifyJWT, createDish);
router.delete("/:id", verifyJWT, deleteDish);

router.get('/getMealsFromSheets', getMenuItemsFromSheets);
export default router;