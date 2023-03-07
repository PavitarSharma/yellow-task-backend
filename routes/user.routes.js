import express from "express";
import userController from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router()

router.get("/:id", auth, userController.getUser)

router.get("/", auth, userController.getAllUsers)

router.delete("/:id", auth, userController.deleteUser)

export default router;
