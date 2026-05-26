const Message = require("../models/Message");

const onlineUsers = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("user-online", (userData) => {
      onlineUsers.set(socket.id, {
        userId: userData._id,
        username: userData.username,
        avatarColor: userData.avatarColor,
        roomId: null,
      });
      io.emit("online-users", getUniqueUsers());
    });

    socket.on("join-room", (roomId) => {
      const user = onlineUsers.get(socket.id);
      if (user && user.roomId) socket.leave(user.roomId);
      socket.join(roomId);
      if (user) user.roomId = roomId;
      io.to(roomId).emit("room-users", getUsersInRoom(roomId));
    });

    socket.on("send-message", async (data) => {
      try {
        const message = await Message.create({
          content: data.content,
          sender: data.senderId,
          room: data.roomId,
        });
        const populated = await message.populate("sender", "username avatarColor");
        io.to(data.roomId).emit("new-message", populated);
      } catch (err) {
        console.error("Message save error:", err);
      }
    });

    socket.on("typing", (data) => {
      socket.to(data.roomId).emit("user-typing", { username: data.username });
    });

    socket.on("stop-typing", (data) => {
      socket.to(data.roomId).emit("user-stop-typing", { username: data.username });
    });

    socket.on("disconnect", () => {
      const user = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);
      io.emit("online-users", getUniqueUsers());
      if (user && user.roomId) {
        io.to(user.roomId).emit("room-users", getUsersInRoom(user.roomId));
      }
    });
  });
};

function getUniqueUsers() {
  const seen = new Set();
  const users = [];
  for (const [, u] of onlineUsers) {
    if (!seen.has(u.userId)) { seen.add(u.userId); users.push(u); }
  }
  return users;
}

function getUsersInRoom(roomId) {
  const seen = new Set();
  const users = [];
  for (const [, u] of onlineUsers) {
    if (u.roomId === roomId && !seen.has(u.userId)) { seen.add(u.userId); users.push(u); }
  }
  return users;
}
