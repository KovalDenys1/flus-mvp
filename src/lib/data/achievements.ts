import { getSupabaseServer } from "../supabase/server";

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

export async function getAchievementsForUser(userId: string): Promise<Achievements> {
  try {
    const supabase = getSupabaseServer();

    // Get completed applications with job categories
    const { data: applications, error } = await supabase
      .from("applications")
      .select(`
        status,
        job:job_id(category)
      `)
      .eq("applicant_id", userId)
      .eq("status", "completed");

    if (error) {
      console.error("Error fetching achievements:", error);
      return getDefaultAchievements();
    }

    // Count completed jobs by category
    const categoryCounts: Record<string, number> = {};
    (applications || []).forEach(app => {
      const category = (app.job as unknown as { category: string })?.category;
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });

    // Calculate XP (1 XP per completed job)
    const xp = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

    // Create category progress
    const perCategory: CategoryProgress[] = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      target: CATEGORY_BADGE_TARGET,
    }));

    // Add categories with 0 progress (for display)
    const allCategories = [
      "Hagearbeid", "IT-hjelp", "Snømåking", "Vask og vedlikehold",
      "Rydding", "Dyrepass", "Ærend", "Småflytting", "Leksehjelp", "Montering"
    ];

    allCategories.forEach(category => {
      if (!perCategory.find(c => c.category === category)) {
        perCategory.push({
          category,
          count: 0,
          target: CATEGORY_BADGE_TARGET,
        });
      }
    });

    // Calculate badges
    const badges: string[] = [];
    if (xp >= 1) badges.push("nykommer");
    if (xp >= 5) badges.push("aktiv");
    if (xp >= 10) badges.push("pålitelig");
    if (xp >= 25) badges.push("ekspert");
    if (xp >= 50) badges.push("mester");

    // Add category-specific badges
    perCategory.forEach(cat => {
      if (cat.count >= CATEGORY_BADGE_TARGET) {
        badges.push(`${cat.category.toLowerCase()}-mester`);
      }
    });

    const canContactCurator = perCategory.some(c => c.count >= CURATOR_THRESHOLD);

    return {
      xp,
      badges: [...new Set(badges)], // Remove duplicates
      perCategory,
      canContactCurator,
    };
  } catch (e) {
    console.error("Exception fetching achievements:", e);
    return getDefaultAchievements();
  }
}

function getDefaultAchievements(): Achievements {
  return {
    xp: 0,
    badges: [],
    perCategory: [
      { category: "Hagearbeid", count: 0, target: CATEGORY_BADGE_TARGET },
      { category: "IT-hjelp", count: 0, target: CATEGORY_BADGE_TARGET },
      { category: "Snømåking", count: 0, target: CATEGORY_BADGE_TARGET },
    ],
    canContactCurator: false,
  };
}

export function computeCanContactCurator(perCategory: CategoryProgress[]) {
  return perCategory.some((c) => c.count >= CURATOR_THRESHOLD);
}