// App component
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Chat from "./pages/Chat.jsx";

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    return !user ? children : <Navigate to="/chat" replace />;
};

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SocketProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to="/chat" replace />} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                    </Routes>
                </SocketProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}