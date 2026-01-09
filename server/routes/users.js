import express from "express";
import * as userController from "../controllers/userController.js";
import passport from "../passportConfig.js";

const router = express.Router();

// User registration, deletion, update and login routes
// Authenticate user for protected routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post(
  "/me/:id",
  passport.authenticate("jwt", { session: false }),
  userController.getProfile
);
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  userController.deleteUser
);
router.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  userController.updateUserDetails
);
router.post("/exists/:username", passport.authenticate("jwt", { session: false }), userController.userExists);

export default router;
