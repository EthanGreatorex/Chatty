import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// User registration and login routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/me/:id", userController.getProfile);

export default router;