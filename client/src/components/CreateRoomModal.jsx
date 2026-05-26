import { useState } from "react";
import API from "../api/axios.js";

export default function CreateRoomModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("general");
  const [emoji, setEmoji] = useState("💬");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emojis = ["💬", "⚛️", "🟢", "🍃", "⚡", "🔥", "🎯", "🚀", "🐍", "☕"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Room name is required");
    setLoading(true);
    try {
      const res = await API.post("/rooms", { name, description, topic, emoji });
      onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal card-cream" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Room</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Room Name</label>
            <input className="input-cream" placeholder="e.g. TypeScript Tips"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label>Description</label>
            <input className="input-cream" placeholder="What's this room about?"
              value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="auth-field">
            <label>Topic</label>
            <select className="input-cream" value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="general">General</option>
              <option value="react">React</option>
              <option value="nodejs">Node.js</option>
              <option value="mongodb">MongoDB</option>
              <option value="express">Express</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="devops">DevOps</option>
            </select>
          </div>
          <div className="auth-field">
            <label>Emoji</label>
            <div className="emoji-picker">
              {emojis.map((em) => (
                <button type="button" key={em}
                  className={`emoji-btn ${emoji === em ? "active" : ""}`}
                  onClick={() => setEmoji(em)}>{em}</button>
              ))}
            </div>
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Room"}
          </button>
        </form>
      </div>
    </div>
  );
}
