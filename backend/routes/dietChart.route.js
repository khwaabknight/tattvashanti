import { Router } from "express";
import { getDietChartsByUser, createDietChart, deleteDietChart, getDietChartsById, sendDietChartEmail, addItemInDietChart } from "../controllers/dietChart.controller.js";
import { createDietChartItem, editDietChartItem } from "../controllers/dietChartItems.controller.js"
import { verifyJWT } from "../middlewares/counsellorAuth.middleware.js";

const router = Router();

router.get("/user/:userId", verifyJWT, getDietChartsByUser);
router.post("/", verifyJWT, createDietChart);
router.get("/:dietChartId", verifyJWT, getDietChartsById);
router.delete("/:id", verifyJWT, deleteDietChart);
router.get("/sendEmail/:dietChartId", verifyJWT, sendDietChartEmail);
router.put("/item/:id",verifyJWT, editDietChartItem);
router.post("/item",verifyJWT, createDietChartItem);
router.put("/addItem",verifyJWT, addItemInDietChart);


export default router;