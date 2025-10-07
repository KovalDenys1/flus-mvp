import { NextRequest, NextResponse } from "next/server";
import {
  initialAchievements,
  computeCanContactCurator,
  CATEGORY_BADGE_TARGET,
  CURATOR_THRESHOLD,
  type Achievements,
} from "../../../lib/data/achievements";

let state: Achievements = {
  ...initialAchievements,
  canContactCurator: computeCanContactCurator(initialAchievements.perCategory),
};

export async function GET() {
  return NextResponse.json({
    achievements: state,
    rules: {
      categoryBadgeTarget: CATEGORY_BADGE_TARGET,
      curatorThreshold: CURATOR_THRESHOLD,
    },
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const inc = body?.increment as { category?: string; by?: number; xp?: number } | undefined;

    if (inc?.category && inc?.by) {
      const entry = state.perCategory.find((c) => c.category === inc.category);
      if (entry) entry.count += inc.by;
      else state.perCategory.push({ category: inc.category, count: inc.by, target: CATEGORY_BADGE_TARGET });
    }
    if (inc?.xp) state.xp += inc.xp;

    state.canContactCurator = computeCanContactCurator(state.perCategory);

    return NextResponse.json({ ok: true, achievements: state });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 400 });
  }
}