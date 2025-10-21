# FLUS — MVP Platform# FLUS — Prototype (Supabase edition)



FLUS er en MVP-plattform for småjobber hvor arbeidsgivere kan opprette jobber og jobbsøkere kan søke og utføre lokale oppgaver. Prosjektet bruker Supabase for persistent lagring og Next.js for frontend/backend.This repository contains the FLUS MVP prototype — a small-job platform for discovering and applying to local tasks, with a lightweight demo chat and a Gründer helper. The prototype uses Supabase for persistent data (jobs, users, applications) while keeping some demo features in-memory for quick exploration.



---This is an educational prototype, not production-ready. It is designed for demos and local development.



## 🚀 Funksjoner---



### For Jobbsøkere (Worker)## High level — what changed

- 🔍 **Finn jobber** - Søk etter jobber med filtre (kategori, avstand, søk)

- 📝 **Søk på jobber** - Send søknader direkte- The project now uses Supabase for persistent data (jobs, users, applications). See `SUPABASE_SETUP.md` for schema and seed SQL.

- 💬 **Samtaler** - Chat med arbeidsgivere- Authentication in the app is Vipps-only (mocked for the demo). The mock Vipps flow creates or finds a user in Supabase and sets a session cookie.

- 🏆 **Prestasjoner** - Se dine oppnådde prestasjoner- The jobs endpoints (`/api/jobs`, `/api/jobs/[id]`) are backed by Supabase. A dev-only seed endpoint is available at `/api/admin/seed/jobs` to populate example jobs quickly.

- 📋 **Mine søknader** - Oversikt over sendte søknader- Applications are inserted into Supabase (`/api/applications`), and the existing chat flow still uses an in-memory conversation store for now (we plan to move chat to Supabase next).

- 👤 **Profil** - Administrer din profil

---

### For Arbeidsgivere (Employer)

- ➕ **Opprett jobber** - Publiser nye jobber med detaljert informasjon## Quick summary of implemented features

- 📋 **Mine jobber** - Oversikt over dine publiserte jobber

- 💬 **Samtaler** - Chat med søkere- **Jobs listing and detail pages** backed by Supabase

- 📊 **Statistikk** - Se statistikk over dine jobber- **Enhanced job scheduling**: Flexible timing, fixed schedules, deadlines

- 👤 **Profil** - Administrer din profil- **Location tracking**: Full addresses, map integration

- **Payment flexibility**: Fixed price or hourly rates

### Forbedret jobbplanlegging- **Job creation form** with all scheduling options at `/jobber/ny`

- **Fleksibel tidsstyring** - Start når som helst- **Apply flow** that creates an application in Supabase and returns a conversation id for the chat UI

- **Faste tider** - Spesifikt tidsrom (f.eks. 12:00-14:00)- **Vipps mock authentication** which creates/fetches users in Supabase and sets a session cookie

- **Frister** - Fullfør innen gitt tid- **Internationalization (i18n)**: Norwegian (default) and English language support

- **Lokasjon** - Fullstendig adresse- **Language switcher**: Toggle between NO/EN in navbar

- **Betalingstyper** - Fast pris eller timepris- **Demo chat and conversations** remain partly in-memory for quick demo conversations

- **Krav** - Spesifikke instruksjoner eller kvalifikasjoner- **Profile page** (demo data) and placeholders for CV; CV persistence will be added next



------



## 🛠️ Teknisk Stack## Developer setup



- **Framework**: Next.js 15.5.4 (App Router, Turbopack)1. Install dependencies

- **Database**: Supabase (PostgreSQL)

- **Styling**: Tailwind CSS 4.0```bash

- **UI Components**: Radix UInpm install

- **Authentication**: Mock Vipps (cookie-based sessions)```

- **Language**: TypeScript

2. Create `.env.local` with Supabase envs (see `SUPABASE_SETUP.md`):

---

```env

## 📋 OppsettNEXT_PUBLIC_SUPABASE_URL=your-project-url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

### 1. Installer avhengigheter# Optional: only for server-side admin tasks

SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

```bash```

npm install

```3. Run the dev server



### 2. Konfigurer Supabase```bash

npm run dev

Opprett `.env.local` i root-mappen:```



```envOpen http://localhost:3000 (or the port printed by Next.js) to view the app.

NEXT_PUBLIC_SUPABASE_URL=din-supabase-url

NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-key---

```

## Important API routes and dev helpers

Se `SUPABASE_SETUP.md` for detaljert informasjon om database-oppsett.

- GET /api/jobs — lists jobs from Supabase

### 3. Kjør migrasjoner- GET /api/jobs/[id] — job detail

- POST /api/admin/seed/jobs — dev-only seed endpoint that inserts example jobs (no UI; use curl or Postman)

Gå til Supabase Dashboard → SQL Editor og kjør:- POST /api/applications — creates an application (requires session) and returns a `conversationId` for the chat UI

- GET /api/auth/vipps/start — mock Vipps start: creates/finds a user in Supabase and sets a session cookie; accepts `?email=` and `?role=` for testing

```sql- GET /api/auth/me — returns current user (reads from Supabase when possible)

-- Se supabase/migrations/add_job_scheduling_fields.sql

```Notes:

- The Vipps mock is intentionally simple for demos. For production, implement real OAuth with Vipps and secure token handling.

### 4. Start dev server

---

```bash

npm run dev## Seed jobs quickly (dev)

```

If your Supabase project has no `jobs` rows yet, use the dev seed endpoint after starting the dev server:

Åpne http://localhost:3000

```bash

---# if Next runs on 3000

curl -X POST http://localhost:3000/api/admin/seed/jobs

## 🔐 Autentisering# or replace port with the one Next reports (3001 etc.)

```

Prosjektet bruker mock Vipps-autentisering for rask testing:

This endpoint will no-op if jobs already exist.

### Logg inn som jobbsøker (worker):

```---

http://localhost:3000/login

→ Velg "Jobbsøker" (👷)## Current limitations and next work

→ Klikk "Logg inn med Vipps"

```- CV persistence: the database schema includes `cv_entries` and `skills`, but the API/UI for saving CV items is not implemented yet. (Planned next.)

- Chat persistence: conversations/messages are still in-memory for demo conversations; migrating chat to Supabase (with optional Realtime) is planned.

### Logg inn som arbeidsgiver (employer):- Auth: current flow is a mocked Vipps flow. Replace with real Vipps OAuth for production.

```

http://localhost:3000/login---

→ Velg "Arbeidsgiver" (💼)

→ Klikk "Logg inn med Vipps"## Developer notes and guidelines

```

- Keep code comments in English. UI should be in Norwegian (as the app is targeted locally).

### Custom brukere (for testing):- Avoid server-side calls to the app itself; prefer using Supabase or other external services from server routes.

```- When changing server routes that return server components, `await params` before using `params.id` to avoid Next.js validator issues.

/api/auth/vipps/start?email=test@example.com&role=employer

```---



---## How to test the Vipps demo flow



## 📁 Prosjektstruktur1. Start the dev server.

2. Open `/login` and click **Fortsett med Vipps**. You should be redirected to `/jobber` and have a session cookie set.

```3. Inspect `/api/auth/me` to see the user record (from Supabase).

src/4. To test different identities: `/api/auth/vipps/start?email=ola@nord.no&role=employer`.

├── app/

│   ├── api/                    # API routes---

│   │   ├── jobs/              # Jobber (GET/POST)

│   │   ├── my-jobs/           # Mine jobber (employer)## Next steps (recommended)

│   │   ├── applications/      # Søknader

│   │   ├── auth/              # Autentisering1. Implement CV API (`/api/cv`) and UI on `/profil` to persist CV entries and skills in Supabase.

│   │   └── ...2. Migrate chat (conversations/messages) to Supabase and enable Realtime for live messaging.

│   ├── jobber/                # Job listing3. Harden auth and replace the mock Vipps flow with real OAuth in a secure server-side flow.

│   │   └── ny/               # Opprett jobb (employer)

│   ├── mine-jobber/           # Mine jobber (employer)---

│   ├── mine-soknader/         # Mine søknader (worker)

│   ├── samtaler/              # Chat## License

│   ├── prestasjoner/          # Prestasjoner

│   ├── statistikk/            # Statistikk (employer)Educational prototype. Reuse for non-commercial, educational purposes with attribution.

│   └── profil/                # Profil

├── components/© 2025 — Denys Koval
│   ├── Navbar.tsx             # Hovednavigasjon med rolebytte
│   ├── JobDetailsDialog.tsx   # Job detaljer modal
│   └── ui/                    # UI komponenter
└── lib/
    ├── data/                  # Data håndtering
    │   ├── sessions.ts        # Session management
    │   ├── users.ts           # User data
    │   └── jobs.ts            # Job data (mock)
    └── utils/                 # Utility funksjoner
```

---

## 🎯 API Endpoints

### Jobs
- `GET /api/jobs` - Hent alle jobber
- `POST /api/jobs` - Opprett ny jobb (krever employer-rolle)
- `GET /api/jobs/[id]` - Hent spesifikk jobb
- `GET /api/my-jobs` - Hent mine jobber (employer)

### Applications
- `GET /api/applications` - Hent mine søknader
- `POST /api/applications` - Send søknad

### Auth
- `GET /api/auth/vipps/start` - Mock Vipps login
- `GET /api/auth/me` - Hent current user
- `POST /api/auth/logout` - Logg ut

---

## 🔄 Rollehåndtering

Systemet støtter to roller:

### Worker (Jobbsøker)
- Kan søke på jobber
- Se mine søknader
- Chatte med arbeidsgivere
- Opptjene prestasjoner

### Employer (Arbeidsgiver)
- Kan opprette jobber
- Se mine jobber
- Chatte med søkere
- Se statistikk

**Rollebytte:** Bruk knappen i navbar for å bytte mellom roller (lagres i localStorage).

---

## 🗄️ Database Schema

### Tables
- `users` - Brukere (id, email, role, navn, kommune)
- `jobs` - Jobber med alle felter inkl. scheduling
- `applications` - Søknader (job_id, applicant_id)
- `conversations` - (In-memory for nå)

Se `SUPABASE_SETUP.md` for fullstendig schema.

---

## ⚙️ Kjente Begrensninger

1. **Mock Authentication** - Bruker forenklet Vipps mock for demo
2. **In-memory Conversations** - Chats lagres i minne (går tapt ved restart)
3. **Ingen geocoding** - Koordinater er default Oslo-sentrum
4. **Statistikk placeholder** - Viser 0 verdier (API ikke implementert)

---

## 🚧 Planlagt Utvikling

- [ ] Ekte Vipps OAuth integration
- [ ] Persistente chat/messages i Supabase
- [ ] Realtime chat med Supabase Realtime
- [ ] Geocoding for adresser
- [ ] Statistikk API med reelle metrikker
- [ ] CV/Resume håndtering
- [ ] Rating system for brukere
- [ ] Push notifications
- [ ] Bildeupplasting for jobber

---

## 📄 Lisens

Educational prototype.  
© 2025 — Denys Koval
