import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import OnlineUsers from "../components/OnlineUsers.jsx";

export default function Chat() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="chat-layout">
      <Sidebar
        currentRoom={currentRoom}
        onSelectRoom={setCurrentRoom}
        onNewRoom={() => setShowModal(true)}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <ChatWindow currentRoom={currentRoom} />
      <OnlineUsers currentRoom={currentRoom} />
    </div>
  );
}
