import { useState, useEffect } from "react";
import API from "../api/axios.js";

export default function RoomList({ currentRoom, onSelectRoom }) {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    API.get("/rooms").then((res) => setRooms(res.data)).catch(console.error);
  }, []);

  const topics = ["all", ...new Set(rooms.map((r) => r.topic))];
  const filtered = filter === "all" ? rooms : rooms.filter((r) => r.topic === filter);

  return (
    <>
      <div className="room-filters">
        {topics.map((t) => (
          <button key={t} className={`room-filter-pill ${filter === t ? "active" : ""}`}
            onClick={() => setFilter(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="room-list">
        {filtered.map((room) => (
          <div key={room._id}
            className={`room-item ${currentRoom?._id === room._id ? "active" : ""}`}
            onClick={() => onSelectRoom(room)}>
            <span className="room-emoji">{room.emoji}</span>
            <div className="room-info">
              <div className="room-name">{room.name}</div>
              <div className="room-desc">{room.description}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-hint">No rooms found</div>
        )}
      </div>
    </>
  );
}
