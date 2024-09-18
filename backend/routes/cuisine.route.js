import { Router } from "express";
import { createCuisine, deleteCuisine, getAllCuisines } from "../controllers/cuisine.controller.js";
import { verifyJWT } from "../middlewares/counsellorAuth.middleware.js";

const router = Router();

router.get("/", verifyJWT, getAllCuisines);
router.post("/", verifyJWT, createCuisine);
router.delete("/:id", verifyJWT, deleteCuisine);

export default router;