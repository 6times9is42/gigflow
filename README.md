# GigFlow — Smart Leads Dashboard

A production-grade MERN Lead Management Dashboard built for a Full Stack Internship submission. Designed with real-world constraints in mind: strict TypeScript, role-based access control, server-side filtering, and a polished UI that works on desktop and mobile.

---

## Live Demo

- **Frontend:** _Coming soon — deploying to Vercel_
- **Backend API:** _Coming soon — deploying to Render_
- **Database:** MongoDB Atlas (free tier)

---

## Features

- JWT authentication with role-based access control (admin / sales)
- Full lead lifecycle: create, view, edit, delete with per-lead ownership enforcement
- Server-side filtering by status and source, full-text search (debounced 400 ms), sort (latest / oldest), and pagination
- URL-synced filter state — refresh preserves your view, links are shareable
- AbortController on in-flight requests to cancel stale responses during rapid filter changes
- CSV export with current filters applied
- Dark / light mode toggle with system preference detection and `localStorage` persistence
- Mobile-responsive: sidebar drawer, card layout on small screens
- Keyboard shortcuts: `/` focuses search, `n` opens Add Lead modal, `Esc` closes modals
- Skeleton loading states, empty states with context-aware messaging, toast notifications
- Docker Compose for one-command local development

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript (strict), Vite 8, TailwindCSS v3 |
| Backend | Node.js 20, Express 4, TypeScript (strict) |
| Database | MongoDB 7, Mongoose 8 |
| Auth | JWT (jsonwebtoken), bcrypt (12 rounds) |
| Validation | Zod v4 (backend middleware + frontend form schemas) |
| HTTP Client | Axios (with auth interceptors) |
| Forms | react-hook-form + @hookform/resolvers/zod |
| Containerization | Docker, Docker Compose, Nginx (SPA fallback) |
| Security | helmet, cors (allowlist), express-rate-limit |

---

## Screenshots

> _Screenshots will be added after deployment. Key views: leads table, dark mode, filter panel, mobile card layout._

---

## Architecture

```
gigflow/
├── client/                   # React + Vite frontend (port 5173 dev / 3000 Docker)
│   └── src/
│       ├── api/              # Axios instance + typed endpoint functions
│       ├── components/
│       │   ├── ui/           # Button, Input, Select, Modal, Badge, Card, Spinner
│       │   ├── leads/        # LeadsTable, LeadRow, LeadForm, LeadFilters, LeadStatusBadge
│       │   ├── layout/       # Sidebar, Topbar, Shell, ProtectedRoute
│       │   └── feedback/     # LoadingSkeleton, EmptyState, ErrorState, Toast
│       ├── context/          # AuthContext (JWT + localStorage persistence)
│       ├── hooks/            # useLeads, useFilters, useDebounce, usePagination
│       ├── pages/            # auth/ (Login, Register), leads/ (List, Detail), NotFound
│       ├── schemas/          # Zod schemas mirroring backend validators
│       └── types/            # Shared TS interfaces (Lead, User, ApiResponse, Pagination)
└── server/                   # Express API (port 5000)
    └── src/
        ├── config/           # env.ts (Zod-validated config), db.ts (Mongoose connect)
        ├── models/           # User.model.ts, Lead.model.ts
        ├── services/         # Business logic (auth.service.ts, leads.service.ts)
        ├── controllers/      # Thin HTTP handlers
        ├── routes/           # auth.routes.ts, leads.routes.ts, index.ts
        ├── middleware/       # auth, role, validate, error
        ├── validators/       # Zod schemas for request validation
        └── utils/            # AppError, asyncHandler, JWT helpers, CSV builder
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- Docker + Docker Compose (for containerized run)
- MongoDB Atlas URI **or** local MongoDB (for manual dev setup)

### Local Development (without Docker)

```bash
# Clone the repo
git clone <repo-url>
cd gigflow

# ── Server ──────────────────────────────────────────────────────
cd server
cp .env.example .env
# Edit .env: set MONGODB_URI to your Atlas URI or local mongo, set JWT_SECRET
npm install
npm run dev        # API available at http://localhost:5000

# ── Client (new terminal) ────────────────────────────────────────
cd client
cp .env.example .env
npm install
npm run dev        # App available at http://localhost:5173
```

### Run with Docker Compose (recommended)

```bash
# From the project root
cp .env.example .env
# Edit .env: update JWT_SECRET at minimum (see comments in the file)

docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:5000/api
- MongoDB: internal to Docker network (data persisted in `mongo_data` volume)

To tear down and wipe the database volume:

```bash
docker compose down -v
```

### Seed test data

After starting the server (dev or Docker), run the seed script to create test users and 50 sample leads:

```bash
cd server
npm run seed
```

---

## API Documentation

See [API.md](API.md) for the full endpoint reference including request/response shapes, query parameters, status codes, and examples.

---

## Test Users (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gigflow.dev | Admin123! |
| Sales | sales@gigflow.dev | Sales123! |

The admin user can see and manage all leads. The sales user can only see and manage their own leads.

---

## What I'd Improve With More Time

- **Refresh token rotation** — currently uses access-token-only auth (fine for this scope); httpOnly cookie + refresh token would be production-hardened
- **WebSocket notifications** — real-time updates when a new lead is assigned to a sales user
- **Jest + Supertest integration tests** — even 10–15 tests on auth + leads CRUD demonstrates test discipline; noted as explicit next step
- **Storybook** — documenting UI primitives in isolation would make the component library genuinely reusable
- **Multi-origin CORS** — supporting multiple simultaneous deployment origins (e.g., preview deployments) without manual env editing
- **Optimistic UI on status updates** — immediate feedback with rollback on API failure
- **Postman collection** — exporting a runnable collection alongside API.md for easier evaluator testing

---

## License

MIT
