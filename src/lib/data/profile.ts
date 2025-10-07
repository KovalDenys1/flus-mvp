export type SocialLink = {
  type: "linkedin" | "github" | "website";
  url: string;
  visible: boolean;
};

export type CvEntry = {
  id: string;
  title: string;
  category: string;
  date: string; // ISO yyyy-mm-dd
};

export type Review = {
  id: string;
  rating: number; // 1..5
  text: string;
  date: string;   // ISO
};

export type WorkerProfile = {
  userId: string;
  name: string;
  ageRange: string; // "15–16"
  kommune: string;
  skills: string[];
  cv: CvEntry[];
  socials: SocialLink[];
  achievements: Record<string, number>;
  xp: number;
};

export const workerProfile: WorkerProfile = {
  userId: "worker1",
  name: "Denys Koval",
  ageRange: "20-21",
  kommune: "Oslo",
  skills: ["Hagearbeid", "IT-hjelp", "Rydding"],
  cv: [
    { id: "c1", title: "Gressklipping hos Per", category: "Hagearbeid", date: "2025-06-10" },
    { id: "c2", title: "IT-hjelp: ruter-oppsett", category: "IT-hjelp", date: "2025-06-15" },
  ],
  socials: [
    { type: "linkedin", url: "https://www.linkedin.com/in/kovaldenys/", visible: true },
    { type: "github",   url: "https://github.com/KovalDenys1",           visible: true },
  ],
  achievements: { "Hagearbeid": 12, "IT-hjelp": 4 },
  xp: 160,
};

export const recentReviews: Review[] = [
  { id: "r1", rating: 5, text: "Punktlig og effektiv.", date: "2025-06-20" },
  { id: "r2", rating: 4.5, text: "God kommunikasjon.",    date: "2025-07-02" },
];