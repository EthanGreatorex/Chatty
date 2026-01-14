import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// User registration, deletion, update and login routes
// Authenticate user for protected routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/me/:id", authenticateJWT, userController.getProfile);
router.delete("/delete/:id", authenticateJWT, userController.deleteUser);
router.put("/update/:id", authenticateJWT, userController.updateUserDetails);
router.post("/exists/:username", authenticateJWT, userController.userExists);

export default router;
