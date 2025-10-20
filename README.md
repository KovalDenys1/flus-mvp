# FLUS — Prototype (Supabase edition)

This repository contains the FLUS MVP prototype — a small-job platform for discovering and applying to local tasks, with a lightweight demo chat and a Gründer helper. The prototype uses Supabase for persistent data (jobs, users, applications) while keeping some demo features in-memory for quick exploration.

This is an educational prototype, not production-ready. It is designed for demos and local development.

---

## High level — what changed

- The project now uses Supabase for persistent data (jobs, users, applications). See `SUPABASE_SETUP.md` for schema and seed SQL.
- Authentication in the app is Vipps-only (mocked for the demo). The mock Vipps flow creates or finds a user in Supabase and sets a session cookie.
- The jobs endpoints (`/api/jobs`, `/api/jobs/[id]`) are backed by Supabase. A dev-only seed endpoint is available at `/api/admin/seed/jobs` to populate example jobs quickly.
- Applications are inserted into Supabase (`/api/applications`), and the existing chat flow still uses an in-memory conversation store for now (we plan to move chat to Supabase next).

---

## Quick summary of implemented features

- Jobs listing and detail pages backed by Supabase
- Apply flow that creates an application in Supabase and returns a conversation id for the chat UI
- Vipps mock authentication which creates/fetches users in Supabase and sets a session cookie
- Demo chat and conversations remain partly in-memory for quick demo conversations
- Profile page (demo data) and placeholders for CV; CV persistence will be added next

---

## Developer setup

1. Install dependencies

```bash
npm install
```

2. Create `.env.local` with Supabase envs (see `SUPABASE_SETUP.md`):

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# Optional: only for server-side admin tasks
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 (or the port printed by Next.js) to view the app.

---

## Important API routes and dev helpers

- GET /api/jobs — lists jobs from Supabase
- GET /api/jobs/[id] — job detail
- POST /api/admin/seed/jobs — dev-only seed endpoint that inserts example jobs (no UI; use curl or Postman)
- POST /api/applications — creates an application (requires session) and returns a `conversationId` for the chat UI
- GET /api/auth/vipps/start — mock Vipps start: creates/finds a user in Supabase and sets a session cookie; accepts `?email=` and `?role=` for testing
- GET /api/auth/me — returns current user (reads from Supabase when possible)

Notes:
- The Vipps mock is intentionally simple for demos. For production, implement real OAuth with Vipps and secure token handling.

---

## Seed jobs quickly (dev)

If your Supabase project has no `jobs` rows yet, use the dev seed endpoint after starting the dev server:

```bash
# if Next runs on 3000
curl -X POST http://localhost:3000/api/admin/seed/jobs
# or replace port with the one Next reports (3001 etc.)
```

This endpoint will no-op if jobs already exist.

---

## Current limitations and next work

- CV persistence: the database schema includes `cv_entries` and `skills`, but the API/UI for saving CV items is not implemented yet. (Planned next.)
- Chat persistence: conversations/messages are still in-memory for demo conversations; migrating chat to Supabase (with optional Realtime) is planned.
- Auth: current flow is a mocked Vipps flow. Replace with real Vipps OAuth for production.

---

## Developer notes and guidelines

- Keep code comments in English. UI should be in Norwegian (as the app is targeted locally).
- Avoid server-side calls to the app itself; prefer using Supabase or other external services from server routes.
- When changing server routes that return server components, `await params` before using `params.id` to avoid Next.js validator issues.

---

## How to test the Vipps demo flow

1. Start the dev server.
2. Open `/login` and click **Fortsett med Vipps**. You should be redirected to `/jobber` and have a session cookie set.
3. Inspect `/api/auth/me` to see the user record (from Supabase).
4. To test different identities: `/api/auth/vipps/start?email=ola@nord.no&role=employer`.

---

## Next steps (recommended)

1. Implement CV API (`/api/cv`) and UI on `/profil` to persist CV entries and skills in Supabase.
2. Migrate chat (conversations/messages) to Supabase and enable Realtime for live messaging.
3. Harden auth and replace the mock Vipps flow with real OAuth in a secure server-side flow.

---

## License

Educational prototype. Reuse for non-commercial, educational purposes with attribution.

© 2025 — Denys Koval