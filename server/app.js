require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const useDemoStore = !process.env.MONGO_URI;

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "devchat-api", mode: useDemoStore ? "demo-memory" : "database" });
});

if (useDemoStore) {
  app.use("/api", require("./routes/demo"));
} else {
  let dbReady;
  app.use(async (req, res, next) => {
    try {
      dbReady = dbReady || connectDB();
      await dbReady;
      next();
    } catch (error) {
      next(error);
    }
  });

  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/rooms", require("./routes/rooms"));
  app.use("/api/messages", require("./routes/messages"));
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;
