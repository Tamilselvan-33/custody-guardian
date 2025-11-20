# Custody Guardian

Full-stack custody-alert workflow with role-based logins for citizens, police and lawyers. Citizens can register, raise alerts, and monitor real-time updates. Police dashboards capture custody, health, and court-production updates. If police fail to respond within 24 hours, alerts auto-escalate to lawyers who can log legal action.

## Tech stack

- Frontend: React (Vite), vanilla CSS, Socket.IO client
- Backend: Node.js, Express, MongoDB, Socket.IO, JWT authentication

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB instance (Atlas or local)

### Backend

```bash
cd server
cp .env.example .env # create this file manually if example is hidden by tooling
# set PORT, MONGODB_URI, JWT_SECRET, CLIENT_ORIGIN
npm install
npm run seed   # optional: creates default police & lawyer accounts
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Set `VITE_API_URL` in `client/.env` if the API host differs from `http://localhost:5000`.

## Core API routes

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Citizen self-registration (returns JWT) |
| POST | `/api/auth/login` | Login for all roles |
| POST | `/api/alerts` | Citizen raises custody alert |
| GET | `/api/alerts/mine` | Citizen alert history |
| GET | `/api/alerts/police` | Police incoming alerts |
| PATCH | `/api/alerts/:id/police-update` | Police status, health, court updates |
| GET | `/api/alerts/lawyer` | Lawyer view of escalated alerts |
| PATCH | `/api/alerts/:id/lawyer-action` | Lawyer records legal response |

## Auto escalation

`server/src/utils/escalationJob.js` audits alerts every 15 minutes. Any alert without a police update in the past 24 hours is escalated automatically, updating status and notifying connected clients over Socket.IO.

## Realtime status

The backend emits `alert:updated` events for alert creation, police updates, escalations, and legal actions. The React client subscribes via `socket.io-client` to refresh dashboards without manual reloads.

## Default accounts

Running `npm run seed` creates:

- Police: `police@custody.guard` / `ChangeMe123!`
- Lawyer: `lawyer@custody.guard` / `ChangeMe123!`

Citizen accounts are created through the public registration form on the homepage.

