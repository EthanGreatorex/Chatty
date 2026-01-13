import express from "express";
import * as userController from "../controllers/userController.js";
import passport from "../passportConfig.js";

const router = express.Router();

// Middleware to handle passport authentication errors
const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Server error", message: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: "Unauthorized", message: info?.message || "Invalid token" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

// User registration, deletion, update and login routes
// Authenticate user for protected routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/me/:id", authenticateJWT, userController.getProfile);
router.delete("/delete/:id", authenticateJWT, userController.deleteUser);
router.put("/update/:id", authenticateJWT, userController.updateUserDetails);
router.post("/exists/:username", authenticateJWT, userController.userExists);

export default router;
