import { useAuth } from "../context/AuthContext.jsx";
import RoomList from "./RoomList.jsx";
import CreateRoomModal from "./CreateRoomModal.jsx";

export default function Sidebar({ currentRoom, onSelectRoom, onNewRoom, showModal, setShowModal }) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo">💬</div>
          <span className="sidebar-title">DevChat</span>
        </div>
        <button className="btn-new-room" onClick={onNewRoom} title="New Room">+</button>
      </div>

      <div className="sidebar-rooms">
        <RoomList currentRoom={currentRoom} onSelectRoom={onSelectRoom} />
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: user?.avatarColor || "#D97706" }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="sidebar-username">{user?.username}</span>
        </div>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>

      {showModal && (
        <CreateRoomModal onClose={() => setShowModal(false)} onCreated={(room) => { setShowModal(false); onSelectRoom(room); }} />
      )}
    </aside>
  );
}
