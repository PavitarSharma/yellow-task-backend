import express from "express";
import passport from "passport";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.createUser);

router.post("/login", authController.loginUser);

router.get("/facebook", passport.authenticate("facebook"));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    successRedirect: "http://localhost:5173",
  }),
  authController.facebookCallback
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
    successRedirect: "http://localhost:5173",
  }),
  authController.googleCallback
);

export default router;
