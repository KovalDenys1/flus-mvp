import { NextResponse } from "next/server";
import { getAchievementsForUser, CATEGORY_BADGE_TARGET, CURATOR_THRESHOLD } from "../../../lib/data/achievements";
import { getSession } from "../../../lib/data/sessions";

export async function GET() {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const achievements = await getAchievementsForUser(user.id);

    return NextResponse.json({
      achievements,
      rules: {
        categoryBadgeTarget: CATEGORY_BADGE_TARGET,
        curatorThreshold: CURATOR_THRESHOLD,
      },
    });
  } catch (e) {
    console.error("Error fetching achievements:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Note: increment parameter is kept for backward compatibility but not used
    // Achievements are automatically calculated from completed jobs

    const achievements = await getAchievementsForUser(user.id);

    return NextResponse.json({ ok: true, achievements });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}