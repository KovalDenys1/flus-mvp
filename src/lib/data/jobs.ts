export type Job = {
  id: string;
  title: string;
  desc: string;
  category: string;
  payNok: number;
  durationMinutes: number;
  areaName: string;
  lat: number;
  lng: number;
  createdAt: string;
  status: "open" | "closed";
};

export const jobs: Job[] = [
  {
    id: "j1",
    title: "Gressklipping",
    desc: "Liten hage. Ta med hansker.",
    category: "Hagearbeid",
    payNok: 300,
    durationMinutes: 90,
    areaName: "Oslo",
    lat: 59.941918,
    lng: 10.900904,
    createdAt: new Date().toISOString(),
    status: "open",
  },
  {
    id: "j2",
    title: "IT-hjelp: sette opp ruter",
    desc: "Konfigurere Wi-Fi og sikre passord.",
    category: "IT-hjelp",
    payNok: 250,
    durationMinutes: 60,
    areaName: "Oslo",
    lat: 59.927336,
    lng: 10.816307,
    createdAt: new Date().toISOString(),
    status: "open",
  },
  {
    id: "j3",
    title: "Snømåking",
    desc: "Oppkjørsel og fortau, ca. 30–40 min.",
    category: "Snømåking",
    payNok: 220,
    durationMinutes: 40,
    areaName: "Oslo",
    lat: 59.91,
    lng: 10.74,
    createdAt: new Date().toISOString(),
    status: "open",
  },
];