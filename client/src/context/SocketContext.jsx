import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext(null);

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
  return import.meta.env.DEV ? window.location.origin : "";
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [socketEnabled, setSocketEnabled] = useState(false);

  useEffect(() => {
    if (!user) {
      setSocket(null);
      setSocketEnabled(false);
      return;
    }

    const socketUrl = getSocketUrl();
    if (!socketUrl) {
      setSocket(null);
      setSocketEnabled(false);
      return;
    }

    const nextSocket = io(socketUrl, {
      transports: ["websocket"],
    });

    nextSocket.on("connect", () => {
      setSocketEnabled(true);
      nextSocket.emit("user-online", user);
    });
    nextSocket.on("disconnect", () => setSocketEnabled(false));
    nextSocket.on("connect_error", () => setSocketEnabled(false));

    setSocket(nextSocket);
    return () => nextSocket.disconnect();
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, socketEnabled }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
