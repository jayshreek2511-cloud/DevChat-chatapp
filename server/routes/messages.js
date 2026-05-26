const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/auth");

// GET /api/messages/:roomId
router.get("/:roomId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate("sender", "username avatarColor")
      .sort({ createdAt: 1 })
      .limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
