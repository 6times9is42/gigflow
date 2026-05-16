# CLAUDE.md — Smart Leads Dashboard Implementation Plan

> **For Claude Code:** This file is your single source of truth for this project. Read it fully before writing any code. Re-read the relevant section before starting each phase. Update the "Progress Log" at the bottom as you complete work.

---

## 1. Mission

Build a **production-grade MERN Lead Management Dashboard** for a Full Stack Internship submission. The bar is "could ship to a real customer" — not "demo-quality." Evaluators will reject submissions for sloppy TypeScript, poor folder structure, missing loading/error states, or hardcoded values. Treat the **Automatic Rejection Criteria** (Section 3) as hard constraints.

**Deliverable:** A monorepo with `client/` (React + TS + Tailwind), `server/` (Node + Express + TS + Mongoose), Docker setup, README, API docs, and `.env.example`.

---

## 2. Mandatory Tech Stack (Non-Negotiable)

| Layer | Tech | Notes |
|---|---|---|
| Frontend framework | React 18 + Vite | Vite over CRA — faster, modern, TS-native |
| Frontend language | **TypeScript (strict mode)** | `any` is banned except where justified in a comment |
| Styling | TailwindCSS | No CSS modules, no styled-components |
| Backend runtime | Node.js (LTS, ≥20) | |
| Backend framework | Express.js | |
| Backend language | **TypeScript (strict mode)** | Same `any` rule |
| Database | MongoDB + Mongoose | Use Atlas free tier for deployment |
| Auth | JWT + bcrypt | Access token only is fine for scope |
| Validation | Zod | Shared schemas between request validation and frontend forms where possible |
| Containerization | Docker + docker-compose | Mandatory, not bonus |

**Plain JavaScript files = automatic rejection.** Every `.ts`/`.tsx` file must compile under `strict: true`.

---

## 3. Automatic Rejection Criteria — Hard Constraints

Treat each of these as a CI gate. Before any commit, mentally check:

- [ ] No `.js` files outside config (`vite.config.ts`, `tailwind.config.ts`, etc. — and even configs should be `.ts` where supported)
- [ ] No `any` types without an inline justification comment
- [ ] No missing interfaces/types on function params, return values, or exported APIs
- [ ] Folder structure matches Section 5 — no flat dumping
- [ ] Every form has validation (Zod + react-hook-form on frontend, Zod middleware on backend)
- [ ] No hardcoded URLs/secrets — everything via `import.meta.env.VITE_*` or `process.env`
- [ ] Every async UI action has `loading`, `error`, and `empty` states
- [ ] No components over ~200 lines — split or extract
- [ ] No copy-pasted boilerplate code without adaptation

---

## 4. Available Skills — When to Use Them

Claude Code has access to specialized skills. **Read the relevant SKILL.md before doing work that matches its description.** This is not optional — skills encode environment-specific knowledge that prevents subtle bugs.

| Task | Skill | When |
|---|---|---|
| Any React component, page, or Tailwind layout | `frontend-design` | **Mandatory** before building the dashboard UI, login pages, leads table, filters, modals. Sets design tokens, spacing, and the aesthetic that avoids generic-AI look. |
| Reading the assignment PDF again or any uploaded reference | `pdf-reading` | If re-checking requirements mid-build |
| Verifying Anthropic API / Claude Code / SDK details | `product-self-knowledge` | Only if integrating Claude into the app (not required here) |
| Generating a README, API docs, or design notes as `.md` | None needed — write directly | |

**Process:** when starting a UI-heavy phase, your **first action** is `view /mnt/skills/public/frontend-design/SKILL.md`. Do not skip this — the design system in that skill is what separates an A submission from a B.

---

## 5. Project Structure

```
smart-leads-dashboard/
├── client/                          # React frontend
│   ├── src/
│   │   ├── api/                     # Axios instance + endpoint functions
│   │   │   ├── client.ts            # Axios with interceptors (auth, errors)
│   │   │   ├── auth.api.ts
│   │   │   └── leads.api.ts
│   │   ├── components/
│   │   │   ├── ui/                  # Primitive reusables (Button, Input, Modal, Badge, Select)
│   │   │   ├── leads/               # LeadsTable, LeadRow, LeadForm, LeadFilters, LeadStatusBadge
│   │   │   ├── layout/              # Sidebar, Topbar, Shell, ProtectedRoute
│   │   │   └── feedback/            # LoadingSpinner, EmptyState, ErrorState, Toast
│   │   ├── pages/
│   │   │   ├── auth/                # Login.tsx, Register.tsx
│   │   │   ├── leads/               # LeadsListPage.tsx, LeadDetailPage.tsx
│   │   │   └── NotFound.tsx
│   │   ├── hooks/                   # useAuth, useDebounce, useLeads, usePagination
│   │   ├── context/                 # AuthContext, ThemeContext (dark mode)
│   │   ├── types/                   # Shared TS interfaces (Lead, User, ApiResponse, etc.)
│   │   ├── lib/                     # utils, formatters, csv-export, constants
│   │   ├── schemas/                 # Zod schemas mirroring backend
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx
│   ├── .env.example
│   ├── Dockerfile
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                          # Node/Express backend
│   ├── src/
│   │   ├── config/                  # env.ts (validated config), db.ts (mongoose connect)
│   │   ├── models/                  # User.model.ts, Lead.model.ts
│   │   ├── controllers/             # auth.controller.ts, leads.controller.ts
│   │   ├── services/                # auth.service.ts, leads.service.ts (business logic)
│   │   ├── routes/                  # auth.routes.ts, leads.routes.ts, index.ts
│   │   ├── middleware/              # auth.middleware.ts, error.middleware.ts, validate.middleware.ts, role.middleware.ts
│   │   ├── validators/              # Zod schemas: auth.schema.ts, leads.schema.ts
│   │   ├── utils/                   # AppError, asyncHandler, jwt helpers, csv builder
│   │   ├── types/                   # Express request augmentation, shared types
│   │   ├── app.ts                   # Express app (no listen)
│   │   └── server.ts                # Entry point (listen)
│   ├── .env.example
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml               # client + server + mongo
├── README.md
├── API.md                           # Full API documentation
└── CLAUDE.md                        # This file
```

**Rules:**
- Co-locate by feature when files grow (e.g., `components/leads/` not `components/forms/LeadForm`)
- One default export per file, named exports for utilities
- File names: `PascalCase.tsx` for components, `camelCase.ts` for everything else, `*.model.ts` / `*.controller.ts` for backend layers

---

## 6. Implementation Phases

**Work one phase at a time. Commit between phases. Do not start Phase N+1 until Phase N is green.**

### Phase 0 — Bootstrap (≈30 min)
1. Initialize monorepo. Two `package.json` files (no workspaces needed — keep simple).
2. `server/`: `npm init`, install `express mongoose bcryptjs jsonwebtoken zod cors helmet morgan dotenv`, devDeps `typescript ts-node-dev @types/* tsconfig-paths`.
3. `client/`: `npm create vite@latest . -- --template react-ts`, install `axios react-router-dom react-hook-form @hookform/resolvers zod tailwindcss postcss autoprefixer lucide-react clsx tailwind-merge`.
4. Configure `tsconfig.json` with `strict: true`, `noImplicitAny: true`, path aliases (`@/` → `src/`).
5. Set up Tailwind + base CSS. Add a `cn()` utility (clsx + tailwind-merge).
6. Create `.env.example` and `.env` for both apps. Wire up `dotenv` on backend, ensure Vite reads `VITE_*`.
7. Verify both apps start with `npm run dev`.
8. **Git:** `feat: bootstrap monorepo with TS, Vite, Tailwind, Express`

### Phase 1 — Backend Foundation (≈1 hr)
1. `config/env.ts`: parse `process.env` through Zod, export typed config. Crash on missing required vars.
2. `config/db.ts`: connect to Mongo with proper error logging, reconnect handling.
3. `app.ts`: middleware order — `helmet`, `cors` (with allowlist from env), `express.json`, `morgan`, routes, 404 handler, error handler.
4. `middleware/error.middleware.ts`: centralized handler. Distinguishes `AppError` (operational) from unknown errors. Never leaks stack traces in production.
5. `utils/AppError.ts`: class with `statusCode`, `message`, `isOperational`.
6. `utils/asyncHandler.ts`: wraps controllers to forward errors to `next()`.
7. `middleware/validate.middleware.ts`: takes a Zod schema, validates `req.body`/`req.query`/`req.params`, throws `AppError(400, ...)` on failure.
8. Health-check route `GET /api/health` returns `{ status: 'ok' }`.
9. **Git:** `feat(server): add error handling, validation, and config foundations`

### Phase 2 — Auth Module (≈1.5 hr)
1. `User.model.ts`:
   ```ts
   interface IUser {
     name: string;
     email: string;      // unique, lowercase, validated
     password: string;   // hashed, never returned via toJSON
     role: 'admin' | 'sales';
     createdAt: Date;
   }
   ```
   - `pre('save')` hook: hash password if modified.
   - Method: `comparePassword(plain: string): Promise<boolean>`.
   - `toJSON` transform: strip `password` and `__v`.
2. `validators/auth.schema.ts`: Zod for register (name, email, password ≥8, optional role for admin-created users) and login.
3. `services/auth.service.ts`: `registerUser`, `loginUser`. Pure business logic, returns user + token. Token signed with `JWT_SECRET`, 7-day expiry.
4. `controllers/auth.controller.ts`: thin — parse, call service, respond.
5. `routes/auth.routes.ts`: `POST /register`, `POST /login`, `GET /me` (protected).
6. `middleware/auth.middleware.ts`: reads `Authorization: Bearer <token>`, verifies, attaches `req.user`.
7. `middleware/role.middleware.ts`: `requireRole(...roles)` — used on routes that need admin.
8. Augment Express types: `server/src/types/express.d.ts` adding `user?: { id: string; role: 'admin' | 'sales' }`.
9. Test with curl/Postman before moving on.
10. **Git:** `feat(server): implement JWT auth with bcrypt and role middleware`

### Phase 3 — Leads Module (≈2 hr)
1. `Lead.model.ts`:
   ```ts
   interface ILead {
     name: string;
     email: string;
     status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
     source: 'Website' | 'Instagram' | 'Referral';
     ownerId: Types.ObjectId;   // ref User — sales users see only their own
     createdAt: Date;
     updatedAt: Date;
   }
   ```
   - Index on `{ ownerId: 1, createdAt: -1 }`, text index on `{ name, email }`.
2. `validators/leads.schema.ts`: create, update (partial), and a `listQuery` schema with `status?`, `source?`, `search?`, `sort?: 'latest'|'oldest'`, `page?: number`, `limit?: number` — all with sensible defaults via Zod.
3. `services/leads.service.ts`: encapsulates the query builder. Build a `filter` object from validated query params:
   - Status/source: direct `$eq`.
   - Search: `$or` on `name` and `email` with case-insensitive regex (escape user input — use a helper).
   - Sort: `createdAt: -1` or `1`.
   - Pagination: `skip = (page-1) * limit`, `limit` capped at 100.
   - **RBAC inside the service**: if `requester.role === 'sales'`, force `filter.ownerId = requester.id`. Admin sees all.
4. List response shape (use everywhere):
   ```ts
   {
     data: Lead[],
     pagination: {
       page: number;
       limit: number;
       total: number;
       totalPages: number;
       hasNext: boolean;
       hasPrev: boolean;
     }
   }
   ```
5. Controllers + routes: full CRUD on `/api/leads`. Detail/update/delete: confirm sales user owns the lead before mutating.
6. CSV export endpoint: `GET /api/leads/export?<same filters>` — streams CSV with the same filters applied. Use a small CSV builder util — escape commas/quotes/newlines properly. **Admins only**, or "current filtered set for current user" for sales — pick one and document it.
7. **Git:** `feat(server): implement leads CRUD with filters, pagination, and CSV export`

### Phase 4 — Frontend Foundation (≈1.5 hr)
**Before starting: `view /mnt/skills/public/frontend-design/SKILL.md`** and let it shape the design choices.

1. Router with `react-router-dom`: public routes (`/login`, `/register`) and protected routes (`/`, `/leads`, `/leads/:id`).
2. `ProtectedRoute` component checks auth state, redirects to `/login` if absent.
3. `AuthContext`: stores `user`, `token`, exposes `login`, `register`, `logout`. Token persisted to `localStorage`. On mount, rehydrate and call `/me` to validate.
4. `api/client.ts`: Axios instance with `baseURL` from env, request interceptor attaches token, response interceptor catches 401 → logout.
5. Layout shell: sidebar + topbar + content. Responsive collapse on mobile. **Dark mode toggle in topbar** (bonus feature — class-based via `dark:` Tailwind variants, persist preference).
6. Build primitives in `components/ui/`: `Button`, `Input`, `Select`, `Modal`, `Badge`, `Card`, `Spinner`. Each has clear props interface, variant support via `cn()` + a small `cva`-style util (or just inline `cn()` calls).
7. Login + Register pages with `react-hook-form` + Zod resolver. Show field-level errors. Disable submit while pending.
8. **Git:** `feat(client): scaffold routing, auth context, dark mode, and UI primitives`

### Phase 5 — Leads Dashboard UI (≈3 hr) — The Centerpiece
**Re-check `frontend-design` skill notes before this.**

1. `LeadsListPage`:
   - Top bar: search input (debounced 400ms via `useDebounce` hook), status filter, source filter, sort dropdown, "Add Lead" button, "Export CSV" button.
   - Table: columns Name, Email, Status (colored badge), Source, Created. Row click → detail. Edit/Delete actions (Delete confirmed via Modal).
   - Footer: pagination controls (Prev/Next + page numbers + "Showing X-Y of Z").
   - **Empty state** when no results (distinguish "no leads yet" vs "no results for filters").
   - **Loading state** as skeleton rows, not just a spinner — feels more polished.
   - **Error state** with retry button.
2. `useLeads` hook: takes the filter/page state, calls API, returns `{ data, pagination, isLoading, error, refetch }`. Re-fetches whenever inputs change. Cancel in-flight requests on rapid filter changes (AbortController).
3. URL-sync filters: read/write `?status=&source=&search=&sort=&page=` so refresh preserves state and links are shareable. Use `useSearchParams`.
4. `LeadForm` (used in Create modal and Edit modal): react-hook-form + Zod. Same schema as backend (literally copy-paste the Zod schema into `client/src/schemas/`).
5. `LeadDetailPage`: fetches by id, shows all fields, has Edit and Delete actions. Sales users who don't own the lead get a 403 from API → show "Not authorized" empty state.
6. CSV export: button calls export endpoint with current filters, receives blob, triggers download. Show spinner on the button while pending.
7. RBAC UI: hide admin-only actions when `user.role !== 'admin'`. Still rely on server enforcement — UI hiding is convenience, not security.
8. **Git:** Make multiple commits here. E.g.: `feat(client): leads table with filters and pagination`, `feat(client): debounced search and URL sync`, `feat(client): lead create/edit modals with form validation`, `feat(client): CSV export and RBAC UI gates`.

### Phase 6 — Polish & Edge Cases (≈1 hr)
1. Toasts for success/error on every mutation (`react-hot-toast` or a tiny custom one).
2. Form-level error display for backend validation failures (parse `error.response.data.errors` if you return field-level errors).
3. Keyboard: Enter submits forms, Esc closes modals, focus traps in modals.
4. Mobile: table becomes card list on `<md`. Filters collapse into a drawer.
5. Empty/error illustrations — simple SVG or Lucide icons, not blank screens.
6. Accessibility: every input has a label, buttons have type, modals have `role="dialog"` + `aria-modal`.
7. Verify dark mode across every page — no hardcoded `bg-white` without `dark:bg-*` pair.
8. **Git:** `polish: toasts, accessibility, mobile responsiveness, dark mode pass`

### Phase 7 — Docker & Deployment (≈1 hr)
1. `server/Dockerfile`: multi-stage (build TS → run from `dist/`). Use `node:20-alpine`. Non-root user.
2. `client/Dockerfile`: multi-stage (build with Vite → serve via Nginx). Include `nginx.conf` that handles SPA fallback (`try_files $uri /index.html`).
3. `docker-compose.yml`: three services — `mongo` (with named volume), `server`, `client`. Healthchecks. Env vars from `.env` file at root (not committed).
4. Test the full stack with `docker compose up --build`.
5. Deploy: client on Vercel/Netlify, server on Render/Railway, DB on Atlas. Update CORS allowlist for the deployed origin. Add deployment URLs to README.
6. **Git:** `chore: add Docker setup and deployment configuration`

### Phase 8 — Documentation (≈45 min)
1. **README.md** — see Section 14 for exact required sections.
2. **API.md** — every endpoint with method, path, auth requirement, request body/query schema, response shape, status codes, example.
3. `.env.example` files — every var needed, with comments. No real secrets.
4. **Git:** `docs: README, API docs, and env examples`

### Phase 9 — Final QA Pass
Run through the **Rejection Criteria checklist** in Section 3. Read every controller, model, component file once. Fix anything that smells off. Run `tsc --noEmit` in both apps — must be zero errors.

---

## 7. TypeScript Standards

- `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`.
- Every exported function: explicit parameter types AND return type. Internal helpers can infer returns.
- Use `interface` for object shapes that might extend; `type` for unions, intersections, mapped types.
- Never use `any`. If you must (e.g., third-party untyped lib), use `// @ts-expect-error TODO: <reason>` or `unknown` + narrowing.
- Prefer `unknown` over `any` for caught errors: `catch (err: unknown) { if (err instanceof ZodError) ... }`.
- Mongoose: define an `IUser` interface, then `Schema<IUser>`, then `model<IUser>('User', schema)`. Use `HydratedDocument<IUser>` when you need the doc type.
- Express: augment `Request` via a `*.d.ts` file, don't cast inline.
- Shared types between client/server: until you set up a shared package, just keep them in sync manually — define on backend, mirror in `client/src/types/api.ts`.

---

## 8. API Design Standards

**Base path:** `/api`

**Response envelope (success):**
```json
{ "data": <payload>, "pagination": { ... }  /* if list */ }
```

**Response envelope (error):**
```json
{ "error": { "message": "Human readable", "code": "VALIDATION_ERROR", "details": { ... } } }
```

**Status codes:**
- `200` GET/PUT/DELETE success
- `201` POST success
- `400` validation failure
- `401` missing/invalid token
- `403` authenticated but forbidden (RBAC)
- `404` resource not found
- `409` conflict (e.g., duplicate email)
- `500` unhandled — leaks no internals in prod

**Endpoints:**

| Method | Path | Auth | Role | Purpose |
|---|---|---|---|---|
| POST | `/api/auth/register` | — | — | Create user (defaults to `sales`) |
| POST | `/api/auth/login` | — | — | Returns `{ user, token }` |
| GET | `/api/auth/me` | ✓ | any | Current user |
| GET | `/api/leads` | ✓ | any | List w/ filters, search, sort, pagination |
| GET | `/api/leads/export` | ✓ | any | CSV stream of filtered set |
| GET | `/api/leads/:id` | ✓ | any (own or admin) | Detail |
| POST | `/api/leads` | ✓ | any | Create (sets ownerId from token) |
| PUT | `/api/leads/:id` | ✓ | any (own or admin) | Update |
| DELETE | `/api/leads/:id` | ✓ | any (own or admin) | Delete |

**Query params on `/api/leads`:**
`status`, `source`, `search`, `sort` (`latest`|`oldest`, default `latest`), `page` (default 1), `limit` (default 10, max 100).

---

## 9. Database Schema

**User**
```ts
{
  _id: ObjectId,
  name: string,                                   // 2–60 chars
  email: string,                                  // unique, lowercased, validated
  password: string,                               // bcrypt hashed, select:false
  role: 'admin' | 'sales',                        // default 'sales'
  createdAt: Date,
  updatedAt: Date
}
```
Indexes: `{ email: 1 }` unique.

**Lead**
```ts
{
  _id: ObjectId,
  name: string,                                   // 2–80 chars
  email: string,                                  // validated
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost',  // default 'New'
  source: 'Website' | 'Instagram' | 'Referral',
  ownerId: ObjectId,                              // ref 'User', indexed
  createdAt: Date,
  updatedAt: Date
}
```
Indexes: `{ ownerId: 1, createdAt: -1 }`, `{ name: 'text', email: 'text' }` (or use regex search — text index is overkill for partial match, regex w/ index on email is fine).

---

## 10. Frontend Patterns

**Component shape:**
```tsx
interface LeadRowProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export function LeadRow({ lead, onEdit, onDelete }: LeadRowProps) {
  // ...
}
```

**Hook shape:**
```ts
export function useLeads(params: LeadsQueryParams): UseLeadsResult {
  // returns { data, pagination, isLoading, error, refetch }
}
```

**Avoid:** prop drilling more than 2 levels (use context), components > 200 lines (split), inline fetch calls (use a hook), inline `tailwind` strings that repeat 3+ times (extract a variant util or a sub-component).

**Reusable feedback components** (build these once, use everywhere):
- `<LoadingSkeleton variant="table" rows={10} />`
- `<EmptyState icon={...} title="..." description="..." action={...} />`
- `<ErrorState error={err} onRetry={...} />`

---

## 11. Security & Best Practices

- Bcrypt rounds: 12 (good balance for an intern project — 10 minimum).
- JWT secret: 32+ random bytes, in env only.
- Rate limit `/api/auth/login` (e.g., `express-rate-limit`, 5 attempts per 15 min per IP). Mention in README.
- Sanitize search input — escape regex special chars before building the Mongo query (`name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`).
- CORS: allowlist from env, not `*`.
- Helmet on by default.
- No password in any log, response, or error payload. Use `select: false` on the schema field.
- Validate `ObjectId` format on `:id` params (Zod refine or Mongoose's `isValidObjectId`).
- Mongo connection: don't expose creds in error messages.

---

## 12. CSV Export Implementation

```ts
// server/src/utils/csv.ts
function escapeCsv(value: unknown): string {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function leadsToCsv(leads: ILead[]): string {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map(l => [l.name, l.email, l.status, l.source, l.createdAt.toISOString()]);
  return [headers, ...rows].map(r => r.map(escapeCsv).join(',')).join('\n');
}
```

Controller sets `Content-Type: text/csv` and `Content-Disposition: attachment; filename="leads-<timestamp>.csv"`. Stream if dataset is large; for an intern project with ≤10k leads, building the string in memory is fine.

---

## 13. Docker Setup

**`server/Dockerfile`:**
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

**`client/Dockerfile`:** similar two-stage with nginx in the final stage. Add `nginx.conf` with SPA fallback.

**`docker-compose.yml`:** three services with internal network, named volume for mongo data, healthcheck on server before client starts.

---

## 14. README.md — Required Sections

1. **Project name + short description**
2. **Live demo links** (frontend URL, optional backend URL)
3. **Features** — bulleted list of what's implemented
4. **Tech stack** — table
5. **Screenshots** — 3-5 key views (leads list, dark mode, filters, mobile)
6. **Architecture** — short diagram or description of folder structure
7. **Getting started**
   - Prerequisites (Node 20+, Docker, Mongo URI)
   - Clone + install
   - `.env` setup (point at `.env.example`)
   - Run dev (both apps)
   - Run with Docker (`docker compose up`)
8. **API documentation** — link to `API.md`
9. **Test users** — seeded admin + sales credentials for evaluators
10. **What I'd improve with more time** — honest, shows engineering maturity
11. **License**

---

## 15. Git Commit Conventions

Use Conventional Commits:
- `feat:` new feature
- `fix:` bug fix
- `refactor:` no behavior change
- `chore:` tooling, deps
- `docs:` documentation
- `style:` formatting only
- `test:` tests

Scope optional but useful: `feat(client): add debounced search`.

**Commit cadence:** small, atomic, frequent. The evaluator looks at commit history — a single "final commit" with everything is a yellow flag.

---

## 16. Things That Will Impress Evaluators

These aren't in the spec but elevate the submission:

- URL-synced filter state (refresh preserves view, shareable links)
- AbortController on in-flight requests during rapid filter changes
- Optimistic UI on delete (with rollback on failure)
- Keyboard shortcuts (`/` to focus search, `n` to open new lead modal)
- A seed script that creates an admin + sales user + 50 sample leads (mention in README)
- Request ID header on errors for traceability
- A small set of backend tests (Jest + supertest) on auth + leads CRUD — even 5–10 tests shows you know how
- Storybook for UI primitives (probably skip — time-expensive — but mention as "what I'd add")

---

## 17. Common Pitfalls to Avoid

- **Storing JWT in localStorage** is fine for this scope. Don't overcomplicate with httpOnly cookies unless you implement CSRF properly.
- **Forgetting to type Express middleware** — always type `(req: Request, res: Response, next: NextFunction)`.
- **Mongoose lean queries** drop types — when using `.lean()`, cast carefully or use `.lean<ILead>()`.
- **Race conditions in search** — without AbortController, slower responses overwrite faster ones.
- **Pagination off-by-one** — `skip = (page - 1) * limit`, not `page * limit`.
- **CORS in production** — Vite uses different origin than the API. Set `credentials: true` only if using cookies.
- **Dark mode flash** — set the `dark` class on `<html>` before React mounts (small script in `index.html` reading from `localStorage`).
- **`useEffect` infinite loops** from object/array deps — memoize query params or use primitive deps.

---

## 18. Final Pre-Submission Checklist

- [ ] `tsc --noEmit` passes on both apps with zero errors
- [ ] `npm run build` succeeds on both apps
- [ ] `docker compose up --build` runs the full stack locally
- [ ] All endpoints in API.md tested manually (Postman collection bonus)
- [ ] README has live links, screenshots, setup instructions, test credentials
- [ ] `.env.example` files committed; real `.env` files in `.gitignore`
- [ ] No `console.log` left in production code (use a logger or remove)
- [ ] No `TODO`/`FIXME` comments in critical paths
- [ ] At least 15+ meaningful commits across the history
- [ ] Repo is public (or invite the reviewer if private)
- [ ] Resume attached to email
- [ ] Email subject matches exactly: `MERN Internship Assignment Submission - <Your Name>`
- [ ] Email sent to `ritik.yadav@servicehive.tech`

---

## 19. Progress Log

> Update after each phase. Helps you (and reviewers reading commit history) see momentum.

- [x] Phase 0 — Bootstrap
- [x] Phase 1 — Backend foundation
- [x] Phase 2 — Auth module
- [x] Phase 3 — Leads module
- [x] Phase 4 — Frontend foundation
- [x] Phase 5 — Leads dashboard UI
- [x] Phase 6 — Polish & edge cases
- [x] Phase 7 — Docker & deployment
- [x] Phase 8 — Documentation
- [x] Phase 9 — Final QA pass

---

## 20. Quick Reference Commands

```bash
# Backend
cd server
npm run dev              # ts-node-dev with watch
npm run build            # tsc
npm run start            # node dist/server.js
npm run typecheck        # tsc --noEmit

# Frontend
cd client
npm run dev              # vite
npm run build            # vite build + tsc
npm run preview          # serve built assets
npm run typecheck        # tsc --noEmit

# Full stack
docker compose up --build
docker compose down -v   # also wipes mongo volume
```

---

**Last reminder for Claude Code:** every UI phase begins with `view /mnt/skills/public/frontend-design/SKILL.md`. Every commit is a discrete unit of work. Every type is explicit. Every async action has loading + error + empty states. Build it like you'd build it at a real job.
