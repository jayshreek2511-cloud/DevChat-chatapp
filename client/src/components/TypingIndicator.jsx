export default function TypingIndicator({ users }) {
  if (!users || users.length === 0) return null;

  const text = users.length === 1
    ? `${users[0]} is typing`
    : `${users.slice(0, 2).join(", ")} ${users.length > 2 ? `and ${users.length - 2} more` : ""} are typing`;

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
      </div>
      <span className="typing-text">{text}</span>
    </div>
  );
}
