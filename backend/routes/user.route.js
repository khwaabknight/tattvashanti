import { Router } from "express";
import { createUser, getAllUsers, deleteUser, getUsersFromSheets } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/counsellorAuth.middleware.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/sheets", getUsersFromSheets);
router.post("/", createUser);
router.delete("/:id", verifyJWT, deleteUser);

export default router;