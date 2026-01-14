import express from "express";
import * as messageController from "../controllers/messageController.js";
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

router.get("/:id",authenticateJWT, messageController.getMessages);
router.post("/",authenticateJWT, messageController.sendMessage);
router.get(
  "/between/:id1/:id2",
  authenticateJWT,
  messageController.getMessagesBetweenUsers
);

export default router;
