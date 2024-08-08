import { Router } from "express";
import { getDietChartsByUser, createDietChart, deleteDietChart, getDietChartsById, sendDietChartEmail } from "../controllers/dietChart.controller.js";
import { editDietChartItem } from "../controllers/dietChartItems.controller.js"
import { verifyJWT } from "../middlewares/counsellorAuth.middleware.js";

const router = Router();

router.get("/user/:userId", verifyJWT, getDietChartsByUser);
router.post("/", verifyJWT, createDietChart);
router.get("/:dietChartId", verifyJWT, getDietChartsById);
router.delete("/:id", verifyJWT, deleteDietChart);
router.get("/sendEmail/:dietChartId", verifyJWT, sendDietChartEmail);
router.put("/item/:id",verifyJWT, editDietChartItem);

export default router;