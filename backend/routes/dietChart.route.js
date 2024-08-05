import { Router } from "express";
import { getDietChartsByUser, createDietChart, deleteDietChart } from "../controllers/dietChart.controller.js";
import { verifyJWT } from "../middlewares/counsellorAuth.middleware.js";

const router = Router();

router.get("/:userId", verifyJWT, getDietChartsByUser);
router.post("/", verifyJWT, createDietChart);
router.delete("/:id", verifyJWT, deleteDietChart);

export default router;