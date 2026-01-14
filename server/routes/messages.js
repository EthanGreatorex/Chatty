import express from "express";
import * as messageController from "../controllers/messageController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", authenticateJWT, messageController.getMessages);
router.post("/", authenticateJWT, messageController.sendMessage);
router.get(
  "/between/:id1/:id2",
  authenticateJWT,
  messageController.getMessagesBetweenUsers
);

export default router;
