export default function MessageBubble({ message, isOwn }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`message msg-animate ${isOwn ? "own" : ""}`}>
      {!isOwn && (
        <div className="message-avatar" style={{ background: message.sender?.avatarColor || "#D97706" }}>
          {message.sender?.username?.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="message-content">
        <div className="message-meta">
          {isOwn ? (
            <span className="you-badge">You</span>
          ) : (
            <span className="message-username">{message.sender?.username}</span>
          )}
          <span className="message-time">{time}</span>
        </div>
        <div className={`message-bubble ${isOwn ? "own" : ""}`}>
          {message.content}
        </div>
      </div>
    </div>
  );
}
