import { Router } from "express";
import { createCounsellor, loginCounsellor, logoutCounsellor, refreshAccessToken, getCurrentCounsellor } from "../controllers/counsellor.controller.js";
import { verifyJWT } from "../middlewares/counsellorAuth.middleware.js";

const router = Router();

router.post("/register", createCounsellor);
router.post("/login", loginCounsellor);
router.post("/logout", verifyJWT, logoutCounsellor);
router.post("/refresh-token", refreshAccessToken);
router.get("/current-user", verifyJWT, getCurrentCounsellor);

export default router;