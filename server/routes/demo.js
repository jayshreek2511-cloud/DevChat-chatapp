const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "devchat-demo-secret";

const state = global.devchatDemoState || {
  users: [],
  rooms: [
    { _id: "react-help", name: "React Help", description: "Hooks, state, and component questions", topic: "react", emoji: "⚛️", isDefault: true, isPrivate: false, createdAt: new Date().toISOString() },
    { _id: "node-debug", name: "Node.js Debug", description: "Async/await, APIs, and server issues", topic: "nodejs", emoji: "🟢", isDefault: true, isPrivate: false, createdAt: new Date().toISOString() },
    { _id: "mongodb-qa", name: "Data Q&A", description: "Schema design and query optimization", topic: "database", emoji: "🗄️", isDefault: true, isPrivate: false, createdAt: new Date().toISOString() },
    { _id: "express-tips", name: "Express Tips", description: "Middleware, routing, and REST APIs", topic: "express", emoji: "⚡", isDefault: true, isPrivate: false, createdAt: new Date().toISOString() },
    { _id: "general-dev", name: "General Dev", description: "Anything and everything dev related", topic: "general", emoji: "💬", isDefault: true, isPrivate: false, createdAt: new Date().toISOString() },
  ],
  messages: [],
};

global.devchatDemoState = state;

const avatarColors = ["#D97706", "#059669", "#7C3AED", "#DC2626", "#2563EB", "#DB2777", "#0891B2", "#65A30D"];

const publicUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  avatarColor: user.avatarColor,
});

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

const protect = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = state.users.find((candidate) => candidate._id === decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};

router.post("/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const exists = state.users.some((user) => user.email === normalizedEmail || user.username === username.trim());
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = {
    _id: uuidv4(),
    username: username.trim(),
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
    avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
  };
  state.users.push(user);

  res.status(201).json({ ...publicUser(user), token: generateToken(user._id) });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields are required" });

  const user = state.users.find((candidate) => candidate.email === email.toLowerCase().trim());
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ ...publicUser(user), token: generateToken(user._id) });
});

router.get("/auth/me", protect, (req, res) => {
  res.json(publicUser(req.user));
});

router.get("/rooms", (req, res) => {
  res.json([...state.rooms].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)));
});

router.get("/rooms/:id", (req, res) => {
  const room = state.rooms.find((candidate) => candidate._id === req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
});

router.post("/rooms", protect, (req, res) => {
  const { name, description, topic, emoji } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: "Room name is required" });

  const room = {
    _id: uuidv4(),
    name: name.trim(),
    description: description || "",
    topic: topic || "general",
    emoji: emoji || "💬",
    isPrivate: false,
    isDefault: false,
    createdBy: publicUser(req.user),
    members: [req.user._id],
    createdAt: new Date().toISOString(),
  };
  state.rooms.push(room);
  res.status(201).json(room);
});

router.post("/rooms/:id/join", protect, (req, res) => {
  const room = state.rooms.find((candidate) => candidate._id === req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
});

router.get("/messages/:roomId", protect, (req, res) => {
  const messages = state.messages
    .filter((message) => message.room === req.params.roomId)
    .slice(-50);
  res.json(messages);
});

router.post("/messages/:roomId", protect, (req, res) => {
  const content = req.body.content?.trim();
  if (!content) return res.status(400).json({ message: "Message content is required" });

  const message = {
    _id: uuidv4(),
    content,
    sender: publicUser(req.user),
    room: req.params.roomId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.messages.push(message);
  res.status(201).json(message);
});

module.exports = router;
