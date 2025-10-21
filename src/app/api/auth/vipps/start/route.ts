import { NextRequest, NextResponse } from "next/server";
import { COOKIE_OPTIONS, SESSION_COOKIE } from "@/lib/utils/cookies";

// Vipps OAuth configuration
const VIPPS_BASE_URL = "https://api.vipps.no";
const VIPPS_AUTH_URL = "https://api.vipps.no/access-management-1.0/access/oauth2/auth";
const VIPPS_TOKEN_URL = "https://api.vipps.no/access-management-1.0/access/oauth2/token";
const VIPPS_USERINFO_URL = "https://api.vipps.no/vipps-userinfo-api/userinfo";

export async function GET(req: NextRequest) {
  // No role selection needed - users can switch roles in the UI
  const state = JSON.stringify({ timestamp: Date.now() });

  // Vipps authorization URL parameters
  const params = new URLSearchParams({
    client_id: process.env.VIPPS_CLIENT_ID!,
    response_type: "code",
    scope: "openid name phoneNumber address email",
    state: Buffer.from(state).toString('base64'),
    redirect_uri: `${req.nextUrl.origin}/api/auth/vipps/callback`,
  });

  const authUrl = `${VIPPS_AUTH_URL}?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
