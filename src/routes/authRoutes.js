import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/signin", authController.signin);

router.get("/signout", authController.signout);

export default router;
