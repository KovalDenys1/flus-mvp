import { NextRequest, NextResponse } from "next/server";
import {
  initialAchievements,
  computeCanContactCurator,
  CATEGORY_BADGE_TARGET,
  CURATOR_THRESHOLD,
  type Achievements,
} from "../../../lib/data/achievements";

const state: Achievements = {
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

interface IncrementData {
  category?: string;
  by?: number;
  xp?: number;
}

function isIncrementData(data: unknown): data is IncrementData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    (typeof obj.category === "string" || typeof obj.category === "undefined") &&
    (typeof obj.by === "number" || typeof obj.by === "undefined") &&
    (typeof obj.xp === "number" || typeof obj.xp === "undefined")
  );
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const inc = isIncrementData(body?.increment) ? body.increment : undefined;

    if (inc?.category && inc?.by) {
      const entry = state.perCategory.find((c) => c.category === inc.category);
      if (entry) entry.count += inc.by;
      else state.perCategory.push({ category: inc.category, count: inc.by, target: CATEGORY_BADGE_TARGET });
    }
    if (inc?.xp) state.xp += inc.xp;

    state.canContactCurator = computeCanContactCurator(state.perCategory);

    return NextResponse.json({ ok: true, achievements: state });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}