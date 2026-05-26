# 💬 DevChat — Real-Time Developer Chat App 🚀

DevChat is a real-time chat platform built for developers to collaborate, ask questions, and share knowledge across topic-based rooms.
It features instant messaging powered by Socket.io, secure JWT authentication, and a warm cream-themed UI designed for long coding sessions.
Whether you're debugging Node.js, discussing React patterns, or just vibing in General Dev — DevChat brings developers together in one place.

## 🛠️ Stack
- **Frontend**: React + Vite + Tailwind CSS + Socket.io-client ⚛️
- **Backend**: Node.js + Express + MongoDB + Socket.io + JWT 🟢

## ⚙️ Setup

### 🖥️ Backend
cd server
npm install
# Edit .env with your MONGO_URI
npm run dev

### 🌐 Frontend
cd client
npm install
npm run dev

## 🔐 .env (server/)
PORT=5000
MONGO_URI=mongodb://localhost:27017/devchat
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173

## ✨ Features
- 🔑 JWT Auth (register/login)
- 🏠 5 default topic rooms
- ⚡ Real-time messaging via Socket.io
- ⌨️ Typing indicators
- 🟢 Online presence tracking
- 🔒 Create private rooms with invite codes
- 📜 Message history (last 50 per room)
- 🎨 Cream/warm light theme UI

---

Created with ❤️ by Jayshree
