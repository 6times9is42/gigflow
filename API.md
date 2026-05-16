# API Documentation — GigFlow Smart Leads Dashboard

**Base URL (dev):** `http://localhost:5000/api`

All protected endpoints require the header:
```
Authorization: Bearer <token>
```

---

## Response Format

**Success (single resource or mutation):**
```json
{ "data": { ... } }
```

**Success (list):**
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Error:**
```json
{
  "error": {
    "message": "Human-readable description",
    "code": "ERROR_CODE",
    "details": { "field": ["validation message"] }
  }
}
```

---

## Auth

### POST /auth/register

Create a new user account. All registrations default to `sales` role. Admin users must be promoted manually (or via a future admin panel).

**Auth required:** No

**Request body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePass1!"
}
```

| Field | Type | Rules |
|-------|------|-------|
| name | string | 2–60 characters |
| email | string | Valid email, unique |
| password | string | Minimum 8 characters |

**Response 201:**
```json
{
  "data": {
    "user": {
      "_id": "664f1a2b3c4d5e6f7a8b9c0d",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "sales",
      "createdAt": "2024-07-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `400 VALIDATION_ERROR` — missing or invalid fields
- `409 CONFLICT` — email already registered

---

### POST /auth/login

Authenticate and receive a JWT. Rate limited to **5 requests per 15 minutes per IP**.

**Auth required:** No

**Request body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass1!"
}
```

**Response 200:**
```json
{
  "data": {
    "user": {
      "_id": "664f1a2b3c4d5e6f7a8b9c0d",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "sales",
      "createdAt": "2024-07-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `400 VALIDATION_ERROR` — missing fields
- `401 INVALID_CREDENTIALS` — wrong email or password
- `429 RATE_LIMITED` — too many attempts

---

### GET /auth/me

Return the current authenticated user's profile.

**Auth required:** Yes (any role)

**Response 200:**
```json
{
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "sales",
    "createdAt": "2024-07-01T10:00:00.000Z"
  }
}
```

**Errors:**
- `401 UNAUTHORIZED` — missing or expired token

---

## Leads

All leads endpoints require authentication.

**RBAC summary:**
- `admin` — can read, create, update, and delete any lead; sees all leads in list/export
- `sales` — can read, create, update, and delete only leads where `ownerId` matches their user ID

---

### GET /leads

List leads with server-side filtering, search, sorting, and pagination.

**Auth required:** Yes (any role)

**Query parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | string | — | Filter by status: `New`, `Contacted`, `Qualified`, `Lost` |
| source | string | — | Filter by source: `Website`, `Instagram`, `Referral` |
| search | string | — | Case-insensitive substring search on `name` and `email` |
| sort | string | `latest` | `latest` (newest first) or `oldest` |
| page | number | `1` | Page number (1-indexed) |
| limit | number | `10` | Results per page (max 100) |

**Response 200:**
```json
{
  "data": [
    {
      "_id": "664f1a2b3c4d5e6f7a8b9c0e",
      "name": "Alice Smith",
      "email": "alice@example.com",
      "status": "New",
      "source": "Website",
      "ownerId": "664f1a2b3c4d5e6f7a8b9c0d",
      "createdAt": "2024-07-01T10:00:00.000Z",
      "updatedAt": "2024-07-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### GET /leads/export

Download the current filtered set of leads as a CSV file. Accepts the same filter/search/sort query parameters as `GET /leads` (page and limit are ignored — the full set is exported).

**Auth required:** Yes (any role — admins export all matching leads, sales users export only their own)

**Response 200:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="leads-1719820800000.csv"

Name,Email,Status,Source,Created At
Alice Smith,alice@example.com,New,Website,2024-07-01T10:00:00.000Z
```

**Errors:**
- `401 UNAUTHORIZED`

---

### GET /leads/:id

Get a single lead by ID.

**Auth required:** Yes. Sales users can only retrieve leads they own; attempting to access another user's lead returns `403`.

**Path parameter:** `:id` — MongoDB ObjectId string

**Response 200:**
```json
{
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "status": "New",
    "source": "Website",
    "ownerId": "664f1a2b3c4d5e6f7a8b9c0d",
    "createdAt": "2024-07-01T10:00:00.000Z",
    "updatedAt": "2024-07-01T10:00:00.000Z"
  }
}
```

**Errors:**
- `400 VALIDATION_ERROR` — invalid ObjectId format
- `403 FORBIDDEN` — lead belongs to another sales user
- `404 NOT_FOUND` — lead does not exist

---

### POST /leads

Create a new lead. The `ownerId` is automatically set from the authenticated user's token — clients cannot assign ownership to another user.

**Auth required:** Yes (any role)

**Request body:**
```json
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "source": "Website",
  "status": "New"
}
```

| Field | Type | Rules |
|-------|------|-------|
| name | string | 2–80 characters, required |
| email | string | Valid email, required |
| source | string | `Website`, `Instagram`, or `Referral`, required |
| status | string | `New`, `Contacted`, `Qualified`, or `Lost`; defaults to `New` |

**Response 201:**
```json
{
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "status": "New",
    "source": "Website",
    "ownerId": "664f1a2b3c4d5e6f7a8b9c0d",
    "createdAt": "2024-07-01T10:00:00.000Z",
    "updatedAt": "2024-07-01T10:00:00.000Z"
  }
}
```

**Errors:**
- `400 VALIDATION_ERROR` — missing or invalid fields

---

### PUT /leads/:id

Update a lead. Accepts a partial body — only the fields provided are updated.

**Auth required:** Yes. Sales users can only update leads they own.

**Path parameter:** `:id` — MongoDB ObjectId string

**Request body (all fields optional):**
```json
{
  "name": "Alice Johnson",
  "email": "alice.j@example.com",
  "status": "Contacted",
  "source": "Referral"
}
```

**Response 200:**
```json
{
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "name": "Alice Johnson",
    "email": "alice.j@example.com",
    "status": "Contacted",
    "source": "Referral",
    "ownerId": "664f1a2b3c4d5e6f7a8b9c0d",
    "createdAt": "2024-07-01T10:00:00.000Z",
    "updatedAt": "2024-07-01T11:00:00.000Z"
  }
}
```

**Errors:**
- `400 VALIDATION_ERROR` — invalid field values
- `403 FORBIDDEN` — lead belongs to another sales user
- `404 NOT_FOUND` — lead does not exist

---

### DELETE /leads/:id

Delete a lead permanently.

**Auth required:** Yes. Sales users can only delete leads they own.

**Path parameter:** `:id` — MongoDB ObjectId string

**Response 200:**
```json
{ "data": null }
```

**Errors:**
- `400 VALIDATION_ERROR` — invalid ObjectId format
- `403 FORBIDDEN` — lead belongs to another sales user
- `404 NOT_FOUND` — lead does not exist

---

## Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST) |
| 400 | Validation error (Zod schema failure or invalid ObjectId) |
| 401 | Missing, malformed, or expired token |
| 403 | Authenticated but not permitted (RBAC — wrong role or wrong owner) |
| 404 | Resource not found |
| 409 | Conflict (e.g., email already registered) |
| 429 | Rate limited (login endpoint) |
| 500 | Internal server error — no stack trace or internals exposed in production |

---

## Error Code Reference

| Code | Endpoint(s) | Meaning |
|------|-------------|---------|
| `VALIDATION_ERROR` | Any | Zod schema validation failed |
| `INVALID_CREDENTIALS` | POST /auth/login | Wrong email or password |
| `UNAUTHORIZED` | Any protected | Token missing, malformed, or expired |
| `FORBIDDEN` | Leads (own check) | Authenticated but not the resource owner |
| `NOT_FOUND` | GET/PUT/DELETE :id | Resource does not exist |
| `CONFLICT` | POST /auth/register | Email already registered |
| `RATE_LIMITED` | POST /auth/login | Too many login attempts |
| `INTERNAL_ERROR` | Any | Unhandled server error |
