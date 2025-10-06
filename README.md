# FLUS – Prototype (Denys Koval)

Dette prosjektet er en fungerende prototype for FLUS – en plattform som hjelper ungdommer med å finne sine første småjobber, bygge erfaring og etter hvert utvikle egne initiativ gjennom en **Gründer-modul**.

> Prosjektet er laget som et skolecase og representerer et teknisk konsept, ikke en kommersiell løsning.

---

## 🎯 Formål

Målet er å gi elever en trygg og enkel måte å finne lokale småjobber på, bygge en digital CV basert på gjennomførte oppdrag, og motta veiledning når de har opparbeidet nok erfaring.

---

## 🔧 Kjernefunksjoner

### For elever (arbeidssøkere)
- Registrering og innlogging med e-post og passord  
- Se jobber i nærheten basert på geografisk avstand  
- Søke på jobber med ett klikk  
- Profil med CV, ferdigheter, prestasjoner og anmeldelser  
- Prestasjonsnivåer og «achievements»  
- Gründer-modul etter høy erfaring (f.eks. 150 oppdrag i én kategori)  
- Personvern og trygg kommunikasjon (ingen direkte kontaktinfo før oppdrag er akseptert)

### For arbeidsgivere
- Registrering og innlogging  
- Opprettelse av jobber (publisering koster én «kreditt» = 100 NOK)  
- Motta og håndtere søknader  
- Gi vurdering og tilbakemelding etter gjennomført oppdrag

---

## 💡 Eksempler på jobbkategorier

- Gressklipping, snømåking, hagearbeid  
- Flyttehjelp, rydding, enkel maling  
- Hundelufting, barnevakt (16+)  
- Enkel IT-hjelp (sette opp ruter, reinstallere PC, oppdatering osv.)  

---

## 🧱 Teknologi

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui  
- **Autentisering:** Credentials (mock i MVP, klar for Prisma/NextAuth)  
- **Database (planlagt):** Prisma + PostgreSQL  
- **Geolokasjon:** klientbasert (navigator.geolocation) – ingen lagring av nøyaktige brukerkoordinater  
- **Datahåndtering:** mock JSON i MVP, REST API-endepunkter i `/api/*`

---

## 🔐 Personvern og trygghet

- Ingen utveksling av telefon/e-post før oppdrag er akseptert  
- Profil viser kun nødvendig informasjon (navn, alder, kommune, ferdigheter)  
- Sosiale lenker kun fra godkjente domener (LinkedIn, GitHub)  
- Filtrering og varsling ved deling av personlig informasjon i meldinger  
- Anmeldelser modereres automatisk (PII-filtrering og språkfilter)  
- Arbeidsgivere verifiseres med e-post og telefon før flere publiseringer  
- Mulighet for foresatt-verifisering (guardian)  
- Alle data lagres innenfor EØS (i produksjon)  

---

## 🏗️ Struktur

.
├─ app/
│  ├─ (pages) login, register, jobber, profil, prestasjoner, grunder
│  └─ api/
│      ├─ auth/
│      ├─ jobs/
│      ├─ applications/
│      ├─ achievements/
│      └─ support/
├─ lib/
│  ├─ data/ (mock data)
│  └─ utils/ (validering, sikkerhet, geo)
├─ docs/
│  ├─ arkitektur.md
│  ├─ personvern.md
│  └─ datamodell.md
└─ README.md

---

## 🧩 Videre utvikling

- Integrasjon med Prisma/PostgreSQL  
- Push-varsler (ny jobb i nærheten)  
- Chat med trygghetstiltak  
- Mentor-/kuratorpanel for Gründer-modul  
- Foreldreinnsyn og eksport av data  

---

## 📜 Lisens

Dette prosjektet er kun for utdanningsformål.  
Koden kan gjenbrukes til ikke-kommersielle formål med kreditering.

© 2025 – Denys Koval
