import express from "express";
import Conversation from "../models/conversation.js";

const router = express.Router();

// Get conversations for a user
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversation.find({ participants: userId });
    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
