import { Router } from "express";
import { createBaseDietChart, deleteBaseDietChart, addItemInBaseDietChart, getAllBaseDietCharts, getBaseDietChartById } from "../controllers/baseDietCharts.controller.js";
import { verifyJWT } from "../middlewares/counsellorAuth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createBaseDietChart);
router.delete("/:id", verifyJWT, deleteBaseDietChart);
router.get("/", verifyJWT, getAllBaseDietCharts);
router.get("/:id", verifyJWT, getBaseDietChartById);
router.put("/addItem", verifyJWT, addItemInBaseDietChart);


export default router;