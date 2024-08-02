import { Router } from "express";
import { createUser, getAllUsers, deleteUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/counsellorAuth.middleware.js";

const router = Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.delete("/:id", verifyJWT, deleteUser);

export default router;