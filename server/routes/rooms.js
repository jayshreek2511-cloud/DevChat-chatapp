const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const { protect } = require("../middleware/auth");

const defaultRooms = [
  { name: "React Help", description: "Hooks, state, and component questions", topic: "react", emoji: "⚛️", isDefault: true },
  { name: "Node.js Debug", description: "Async/await, APIs, and server issues", topic: "nodejs", emoji: "🟢", isDefault: true },
  { name: "MongoDB Q&A", description: "Schema design and query optimization", topic: "mongodb", emoji: "🍃", isDefault: true },
  { name: "Express Tips", description: "Middleware, routing, and REST APIs", topic: "express", emoji: "⚡", isDefault: true },
  { name: "General Dev", description: "Anything and everything dev related", topic: "general", emoji: "💬", isDefault: true },
];

const seedDefaultRooms = async () => {
  const count = await Room.countDocuments({ isDefault: true });
  if (count === 0) {
    await Room.insertMany(defaultRooms);
    console.log("Default rooms seeded");
  }
};

router.get("/", async (req, res) => {
  try {
    await seedDefaultRooms();
    const rooms = await Room.find({ isPrivate: false })
      .populate("createdBy", "username avatarColor")
      .sort({ isDefault: -1, createdAt: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("createdBy", "username avatarColor")
      .populate("members", "username avatarColor");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { name, description, topic, emoji, isPrivate } = req.body;
    if (!name) return res.status(400).json({ message: "Room name is required" });

    const room = await Room.create({
      name,
      description: description || "",
      topic: topic || "general",
      emoji: emoji || "💬",
      isPrivate: isPrivate || false,
      createdBy: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/join", protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.isPrivate && room.inviteCode !== req.body.inviteCode) {
      return res.status(403).json({ message: "Invalid invite code" });
    }

    if (!room.members.includes(req.user._id)) {
      room.members.push(req.user._id);
      await room.save();
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
