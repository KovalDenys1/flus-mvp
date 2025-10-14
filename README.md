# FLUS — Prototype

This repository contains a working prototype for FLUS — a small-job platform focused on helping young people find local tasks, build experience, and eventually gain access to an entrepreneurship module.

The project is a technical MVP and educational prototype. It is not a production-grade or commercial-ready system.

---

## Quick summary

- Small-job listing and application flow
- Demo chat between job posters and applicants (in-memory/demo data)
- Simple authentication (mock sessions)
- Mock data under `src/lib/data` used by API routes in `src/app/api`

---

## Features implemented in this prototype

- Job browsing with simple filtering and distance-based visibility
- Job detail page with an interactive client component for applying
- Conversations (chat) UI with demo conversations and demo messages
- REST-style API routes for jobs, conversations, messages and auth
- Basic profile and session mock helpers

---

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- In-memory mock data for MVP located in `src/lib/data`

---

## Developer setup

1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

Notes:
- The project uses mock session cookies and in-memory data (no real database). Demo conversations and messages are generated from `src/lib/data`.

---

## Developer notes

- Avoid making server-side HTTP requests to the same application (no localhost fetch from server routes); server routes should import local data or use real backend services.
- Dynamic routes returning server components should `await params` when necessary before accessing `params.id`.

---

## Demo data and chat

- Demo conversations and demo messages are defined under `src/lib/data` to make the chat UI interactive without a database. The demo data is lightweight and intended for exploration only.

---

## Privacy & safety (prototype)

- No personal data is persisted in this MVP — data lives in-memory for demo purposes only.
- The chat feature is a demo; do not use it for real PII in this prototype.

---

## Next steps (ideas)

- Add a persistent backend (Prisma + PostgreSQL)
- Harden auth and session handling (NextAuth/credentials setup)
- Add server-side validation and PII filters for chat messages

---

## License

Educational prototype. Reuse for non-commercial, educational purposes with attribution.

© 2025 — Denys Koval