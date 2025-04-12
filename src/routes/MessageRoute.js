// backend/routes/messagesRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../model/MessageModel");

// Get messages between two users
router.get("/messages/:userId1/:userId2", async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    }).sort({ createdAt: 1 }); // Sort by creation time
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;