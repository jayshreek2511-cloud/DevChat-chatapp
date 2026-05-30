import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import API from "../api/axios.js";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

export default function ChatWindow({ currentRoom }) {
  const { user } = useAuth();
  const { socket, socketEnabled } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEnd = useRef(null);
  const typingTimeout = useRef(null);

  const loadMessages = async () => {
    if (!currentRoom) return;
    const res = await API.get(`/messages/${currentRoom._id}`);
    setMessages(res.data);
  };

  useEffect(() => {
    if (!currentRoom) return;

    setMessages([]);
    setTypingUsers([]);
    loadMessages().catch(console.error);

    if (socketEnabled && socket) {
      socket.emit("join-room", currentRoom._id);
      return;
    }

    const intervalId = window.setInterval(() => {
      loadMessages().catch(console.error);
    }, 2500);
    return () => window.clearInterval(intervalId);
  }, [currentRoom, socket, socketEnabled]);

  useEffect(() => {
    if (!socketEnabled || !socket) return;
    const handler = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("new-message", handler);
    return () => socket.off("new-message", handler);
  }, [socket, socketEnabled]);

  useEffect(() => {
    if (!socketEnabled || !socket) return;
    const onTyping = (data) => {
      setTypingUsers((prev) => prev.includes(data.username) ? prev : [...prev, data.username]);
    };
    const onStopTyping = (data) => {
      setTypingUsers((prev) => prev.filter((username) => username !== data.username));
    };
    socket.on("user-typing", onTyping);
    socket.on("user-stop-typing", onStopTyping);
    return () => {
      socket.off("user-typing", onTyping);
      socket.off("user-stop-typing", onStopTyping);
    };
  }, [socket, socketEnabled]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleTyping = () => {
    if (!socketEnabled || !socket || !currentRoom) return;
    socket.emit("typing", { roomId: currentRoom._id, username: user.username });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", { roomId: currentRoom._id, username: user.username });
    }, 1500);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || !currentRoom) return;

    setInput("");
    if (socketEnabled && socket) {
      socket.emit("send-message", { content, senderId: user._id, roomId: currentRoom._id });
      socket.emit("stop-typing", { roomId: currentRoom._id, username: user.username });
      return;
    }

    try {
      const res = await API.post(`/messages/${currentRoom._id}`, { content });
      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      setInput(content);
      console.error(error);
    }
  };

  if (!currentRoom) {
    return (
      <main className="chat-main">
        <div className="chat-empty">
          <div className="chat-empty-icon">💬</div>
          <h2>Welcome to DevChat</h2>
          <p>Select a room from the sidebar to start chatting</p>
        </div>
      </main>
    );
  }

  return (
    <main className="chat-main">
      <div className="chat-header">
        <span className="chat-header-emoji">{currentRoom.emoji}</span>
        <div>
          <div className="chat-header-name">{currentRoom.name}</div>
          <div className="chat-header-desc">{currentRoom.description}</div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} isOwn={msg.sender?._id === user._id} />
        ))}
        <TypingIndicator users={typingUsers} />
        <div ref={messagesEnd} />
      </div>
      <form className="chat-input-area" onSubmit={sendMessage}>
        <input
          className="input-cream chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
        />
        <button className="btn-send" type="submit" disabled={!input.trim()}>Send</button>
      </form>
    </main>
  );
}
