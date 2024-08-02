import { Router } from "express";
import { getDietChartsByUser, createDietChart, updateDietChart, deleteDietChart } from "../controllers/dietChart.controller.js";
import { verifyJWT } from "../middlewares/counsellorAuth.middleware.js";

const router = Router();

router.get("/:userId", verifyJWT, getDietChartsByUser);
router.post("/", verifyJWT, createDietChart);
router.put("/", verifyJWT, updateDietChart);
router.delete("/:id", verifyJWT, deleteDietChart);

export default router;