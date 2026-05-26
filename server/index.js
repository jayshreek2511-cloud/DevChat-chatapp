require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

const start = async () => {
  // Connect to DB FIRST
  await connectDB();

  // THEN mount routes (rooms.js seeds data on require)
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/rooms", require("./routes/rooms"));
  app.use("/api/messages", require("./routes/messages"));

  // Socket.io
  require("./socket/socketHandler")(io);

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
