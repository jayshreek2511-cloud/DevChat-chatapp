import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      await register(username, email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card-cream">
        <div className="auth-logo">
          <div className="auth-logo-icon">💬</div>
          <h1 className="auth-title">DevChat</h1>
          <p className="auth-subtitle">Join the developer community</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Username</label>
            <input className="input-cream" type="text" placeholder="cooldev42"
              value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input className="input-cream" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input className="input-cream" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <input className="input-cream" type="password" placeholder="••••••••"
              value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
