# EDUverse

A gamified learning platform where students earn XP, level up, unlock achievements, and compete on leaderboards while taking courses and connecting with friends.

## Features

- **Authentication** — JWT-based register/login with role support (student, instructor, admin)
- **Courses** — Browse, enroll, and complete lessons to earn XP
- **Progression** — Levels, streaks, and XP multipliers
- **Gamification** — Achievements, badges, quests, and leaderboards
- **Social** — Friend requests, activity feed, user search, and teams (API)
- **Real-time** — Socket.io server for chat and activity updates (backend ready)

## Tech Stack

| Layer | Stack |
|-------|-------|
| Backend | Node.js, TypeScript, Express, MongoDB |
| Frontend | React 18, TypeScript, Vite |
| Auth | JWT  |
| Optional | Redis (caching), Socket.io |

## Project Structure

```
eduverse/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── pages/          # Route pages
│       ├── components/     # Navbar, ConfigError
│       ├── store/          # Auth state (Zustand)
│       └── api/            # Axios client
├── src/                    # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── scripts/            # Database seeding
├── services/               # Future MMO microservices (not wired to main app)
└── packages/               # Shared types (future architecture)
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional, for caching)

## Local Development

### 1. Install dependencies

```bash
npm install
cd client && npm install && cd ..
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/eduverse
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional
REDIS_HOST=localhost
REDIS_PORT=6379
```

Create `client/.env` from the example:

```bash
cp client/.env.example client/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

```bash
mongod
```

### 4. Seed the database (optional)

Populates achievements, badges, quests, and sample courses:

```bash
npm run seed
```

### 5. Run the app

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run backend and frontend concurrently |
| `npm run dev:server` | Backend only (nodemon) |
| `npm run dev:client` | Frontend only (Vite) |
| `npm run build` | Build server and client |
| `npm start` | Run production server (`dist/server.js`) |
| `npm run seed` | Seed achievements, badges, quests, and courses |

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | Stats, achievements preview, activity feed |
| `/courses` | Course catalog with search and filters |
| `/courses/:id` | Course detail, enroll, complete lessons |
| `/leaderboard` | XP and level rankings |
| `/achievements` | Full achievement grid |
| `/social` | Activity feed, friends, user search |

## API Overview

All endpoints are prefixed with `/api`.

### Auth
- `POST /auth/register` — Register
- `POST /auth/login` — Login
- `GET /auth/me` — Current user (protected)

### Courses
- `GET /courses` — List courses (search, category, difficulty filters)
- `GET /courses/:id` — Course detail
- `POST /courses/:id/enroll` — Enroll (protected)
- `POST /courses/lessons/:id/complete` — Complete lesson (protected)
- `POST /courses` — Create course (instructor/admin)
- `PUT /courses/:id` — Update course (instructor/admin)

### Game
- `GET /game/stats` — User stats (protected)
- `GET /game/leaderboard` — Leaderboard
- `GET /game/achievements` — Achievements (protected)
- `POST /game/check-achievements` — Check for new unlocks (protected)
- `GET /game/quests` — Quests (protected)
- `POST /game/quests/:id/complete` — Complete quest (protected)

### Social
- `GET /social/friends` — Friends and pending requests (protected)
- `POST /social/friends/request/:userId` — Send friend request (protected)
- `POST /social/friends/accept/:userId` — Accept request (protected)
- `GET /social/activity` — Activity feed (protected)
- `GET /social/users/search` — Search users (protected)
- `POST /social/teams` — Create team (protected)
- `GET /social/teams/:id` — Get team (protected)
- `POST /social/teams/:id/join` — Join team (protected)

## Deployment

This app uses a **split architecture**: the frontend and backend deploy separately.

### Frontend (Vercel)

1. Set the Vercel root directory to `client` (recommended), or use the root `vercel.json`.
2. Add the environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
   The value must include `/api` and point to your live backend.
3. Deploy. SPA routing is handled via `vercel.json` rewrites.

### Backend (Railway, Render, etc.)

Deploy the Express server to a host that supports long-running Node.js processes and WebSockets.

Required environment variables:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
CLIENT_URL=https://your-frontend-url.vercel.app
PORT=5000
NODE_ENV=production
```

> Vercel's free tier does not run the Express backend. The backend must be hosted elsewhere.

## License

MIT
