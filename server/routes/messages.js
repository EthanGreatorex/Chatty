import express from "express";
import * as messageController from "../controllers/messageController.js";

const router = express.Router();

router.get("/:id", messageController.getMessages);
router.post("/", messageController.sendMessage);
router.get(
  "/between/:id1/:id2",
  messageController.getMessagesBetweenUsers
);

export default router;
