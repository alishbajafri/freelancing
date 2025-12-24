import express from "express";
import Message from "../models/message.js";

const router = express.Router();

// ----------------------------------------
// 1️⃣ SEND a message
// ----------------------------------------
router.post("/send", async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, message } = req.body;

    const newMsg = new Message({
      conversationId,
      senderId,
      receiverId,
      message,
    });

    await newMsg.save();

    res.status(201).json({ success: true, message: "Message sent", data: newMsg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------
// 2️⃣ GET all messages for a conversation
// ----------------------------------------
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
