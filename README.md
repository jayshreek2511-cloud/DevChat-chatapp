# DevChat — Developer Chat Demo

DevChat is a topic-based chat app built with React, Express, MongoDB, JWT auth, and Socket.io.

It is Vercel-ready:

- Local development uses Socket.io for realtime chat.
- Vercel demo deployments use serverless API routes plus automatic message polling, because Vercel serverless functions do not keep long-lived Socket.io connections alive.
- If `MONGO_URI` is not set, the app uses a built-in memory store so the demo works without MongoDB Atlas.

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Express, MongoDB, Mongoose, JWT
- Realtime locally: Socket.io
- Demo deployment: Vercel serverless API + memory store

## Local Setup

Backend:

```bash
cd server
npm install
cp ../.env.example .env
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```

## Vercel Deployment

Deploy the repository root to Vercel.

For the simplest demo, add only these environment variables in Vercel:

```env
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
VITE_API_URL=/api
```

Leave `VITE_SOCKET_URL` empty on Vercel. The app will use polling so messages still work in the hosted demo.

Do not add `MONGO_URI` if you want the no-database demo mode.

## Build Check

```bash
npm run build --prefix client
```

## Notes

- Demo mode data is temporary. It can reset when Vercel restarts the serverless function.
- If you later want true hosted realtime chat, deploy the `server/` folder to a long-running Node host such as Render, Railway, or Fly.io, then set `VITE_SOCKET_URL` to that backend URL.
