import express from "express";
import contactController from "../controllers/contact.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router()

router.post("/", auth, contactController.createContact)

router.get("/", auth, contactController.getAllContact)

router.get("/:id", auth, contactController.getSingleContact)

router.patch("/:id", auth, contactController.updateContact)

router.delete("/:id", auth, contactController.deleteContact)

export default router