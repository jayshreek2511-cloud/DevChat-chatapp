import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext.jsx";

export default function OnlineUsers({ currentRoom }) {
  const { socket } = useSocket();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!socket) return;
    const handler = (list) => setUsers(list);
    socket.on("room-users", handler);
    socket.on("online-users", handler);
    return () => { socket.off("room-users", handler); socket.off("online-users", handler); };
  }, [socket]);

  return (
    <aside className="online-panel">
      <div className="online-header">
        <span>Online</span>
        <span className="online-count">{users.length}</span>
      </div>
      <div className="online-list">
        {users.map((u) => (
          <div key={u.userId} className="online-user">
            <div className="online-avatar" style={{ background: u.avatarColor || "#D97706" }}>
              {u.username?.charAt(0).toUpperCase()}
            </div>
            <span className="online-username">{u.username}</span>
            <span className="online-dot"></span>
          </div>
        ))}
        {users.length === 0 && (
          <div className="empty-hint">
            {currentRoom ? "No users in this room" : "Select a room"}
          </div>
        )}
      </div>
    </aside>
  );
}
