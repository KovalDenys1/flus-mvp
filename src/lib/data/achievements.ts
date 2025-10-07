export type CategoryProgress = {
  category: string;
  count: number;
  target: number;
};

export type Achievements = {
  xp: number;
  badges: string[];
  perCategory: CategoryProgress[];
  canContactCurator: boolean;
};

export const CATEGORY_BADGE_TARGET = 10;
export const CURATOR_THRESHOLD = 150;

export const initialAchievements: Achievements = {
  xp: 160,
  badges: ["nykommer", "paalitelig"],
  perCategory: [
    { category: "Hagearbeid", count: 12, target: CATEGORY_BADGE_TARGET },
    { category: "IT-hjelp",   count: 4,  target: CATEGORY_BADGE_TARGET },
    { category: "Snømåking",  count: 0,  target: CATEGORY_BADGE_TARGET },
  ],
  canContactCurator: false,
};

export function computeCanContactCurator(perCategory: CategoryProgress[]) {
  return perCategory.some((c) => c.count >= CURATOR_THRESHOLD);
}