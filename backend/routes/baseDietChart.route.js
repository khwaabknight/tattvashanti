import { Router } from "express";
import { createBaseDietChart, deleteBaseDietChart } from "../controllers/baseDietCharts.controller.js";
import { verifyJWT } from "../middlewares/counsellorAuth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createBaseDietChart);
router.delete("/:id", verifyJWT, deleteBaseDietChart);

export default router;