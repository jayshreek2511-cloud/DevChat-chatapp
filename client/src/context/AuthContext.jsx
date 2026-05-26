import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("devchat_token");
    if (token) {
      API.get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("devchat_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("devchat_token", res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await API.post("/auth/register", { username, email, password });
    localStorage.setItem("devchat_token", res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("devchat_token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading DevChat...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
