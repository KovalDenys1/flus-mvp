import { getSupabaseServer } from "../supabase/server";

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
  reviewerName?: string;
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

export async function getWorkerProfile(userId: string): Promise<WorkerProfile | null> {
  try {
    const supabase = getSupabaseServer();

    // Get user basic info
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("navn, kommune, fodselsdato")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      console.error("Error fetching user profile:", userError);
      return null;
    }

    // Get CV entries
    const { data: cvEntries, error: cvError } = await supabase
      .from("cv_entries")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (cvError) {
      console.error("Error fetching CV entries:", cvError);
    }

    // Get skills
    const { data: skills, error: skillsError } = await supabase
      .from("skills")
      .select("skill")
      .eq("user_id", userId);

    if (skillsError) {
      console.error("Error fetching skills:", skillsError);
    }

    // Calculate age range
    let ageRange = "18-25"; // default
    if (user.fodselsdato) {
      const birthYear = new Date(user.fodselsdato).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      if (age < 18) ageRange = "15-17";
      else if (age < 25) ageRange = "18-24";
      else if (age < 35) ageRange = "25-34";
      else if (age < 50) ageRange = "35-49";
      else ageRange = "50+";
    }

    // Get achievements data
    const achievements = await getAchievementsForUser(userId);

    return {
      userId,
      name: user.navn || "Anonym",
      ageRange,
      kommune: user.kommune || "Oslo",
      skills: (skills || []).map(s => s.skill),
      cv: (cvEntries || []).map(entry => ({
        id: entry.id,
        title: entry.title,
        category: entry.category,
        date: entry.date,
      })),
      socials: [], // TODO: Implement social links table
      achievements,
      xp: achievements.xp,
    };
  } catch (e) {
    console.error("Exception fetching worker profile:", e);
    return null;
  }
}

export async function getAchievementsForUser(userId: string): Promise<Record<string, number>> {
  try {
    const supabase = getSupabaseServer();

    const { data: applications, error } = await supabase
      .from("applications")
      .select(`
        job:job_id(category)
      `)
      .eq("applicant_id", userId)
      .eq("status", "completed");

    if (error) {
      console.error("Error fetching achievements for user:", error);
      return {};
    }

    const achievements: Record<string, number> = {};
    (applications || []).forEach(app => {
      const category = (app.job as unknown as { category: string })?.category;
      if (category) {
        achievements[category] = (achievements[category] || 0) + 1;
      }
    });

    return achievements;
  } catch (e) {
    console.error("Exception fetching achievements:", e);
    return {};
  }
}

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  try {
    const supabase = getSupabaseServer();

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        text,
        created_at,
        reviewer:reviewer_id(navn)
      `)
      .eq("reviewed_user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    return (reviews || []).map(review => ({
      id: review.id,
      rating: review.rating,
      text: review.text,
      date: review.created_at,
      reviewerName: (review.reviewer as unknown as { navn: string })?.navn,
    }));
  } catch (e) {
    console.error("Exception fetching reviews:", e);
    return [];
  }
}

export async function addCvEntry(userId: string, entry: Omit<CvEntry, 'id'>): Promise<boolean> {
  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from("cv_entries")
      .insert({
        user_id: userId,
        title: entry.title,
        category: entry.category,
        date: entry.date,
      });

    if (error) {
      console.error("Error adding CV entry:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Exception adding CV entry:", e);
    return false;
  }
}

export async function addSkill(userId: string, skill: string): Promise<boolean> {
  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from("skills")
      .insert({
        user_id: userId,
        skill,
      });

    if (error) {
      console.error("Error adding skill:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Exception adding skill:", e);
    return false;
  }
}