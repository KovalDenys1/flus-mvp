import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { createSession } from "@/lib/data/sessions";
import { COOKIE_OPTIONS, SESSION_COOKIE } from "@/lib/utils/cookies";

// Vipps OAuth configuration
const VIPPS_TOKEN_URL = "https://api.vipps.no/access-management-1.0/access/oauth2/token";
const VIPPS_USERINFO_URL = "https://api.vipps.no/vipps-userinfo-api/userinfo";

interface VippsTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface VippsUserInfo {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  phone_number?: string;
  address?: {
    street_address?: string;
    postal_code?: string;
    region?: string;
    country?: string;
  };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    console.error("Vipps OAuth error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=missing_params", req.url));
  }

  try {
    // Decode state to get role and birthYear
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
    const role = decodedState.role || 'worker';
    const birthYear = decodedState.birthYear;

    // Exchange authorization code for access token
    const tokenResponse = await fetch(VIPPS_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(`${process.env.VIPPS_CLIENT_ID}:${process.env.VIPPS_CLIENT_SECRET}`).toString('base64')}`,
        "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY!,
        "Merchant-Serial-Number": process.env.VIPPS_MSN!,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${req.nextUrl.origin}/api/auth/vipps/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Failed to get access token:", await tokenResponse.text());
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", req.url));
    }

    const tokenData: VippsTokenResponse = await tokenResponse.json();

    // Get user info from Vipps
    const userInfoResponse = await fetch(VIPPS_USERINFO_URL, {
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY!,
        "Merchant-Serial-Number": process.env.VIPPS_MSN!,
      },
    });

    if (!userInfoResponse.ok) {
      console.error("Failed to get user info:", await userInfoResponse.text());
      return NextResponse.redirect(new URL("/login?error=userinfo_failed", req.url));
    }

    const userInfo: VippsUserInfo = await userInfoResponse.json();

    // Create or find user in Supabase
    const supabase = getSupabaseServer();

    // Use Vipps sub (subject) as unique identifier, or email if available
    const uniqueId = userInfo.sub;
    const email = userInfo.email || `${uniqueId}@vipps.user`;

    // Try to find existing user
    const { data: existing } = await supabase
      .from("users")
      .select("id, email, role, navn, kommune")
      .eq("email", email)
      .maybeSingle();

    let userId: string | null = existing?.id ?? null;

    // If user doesn't exist, create new one with selected role and birth year
    if (!userId) {
      const { data: inserted, error } = await supabase
        .from("users")
        .insert({
          email,
          role,
          navn: userInfo.name,
          telefon: userInfo.phone_number,
          birth_year: birthYear ? parseInt(birthYear) : null,
        })
        .select("id")
        .maybeSingle();

      if (error) {
        console.error("Failed to create user:", error);
        return NextResponse.redirect(new URL("/login?error=user_creation_failed", req.url));
      }

      userId = inserted?.id ?? null;
    } else {
      // Update existing user with new role and birth year if provided
      const updateData: Record<string, string | number> = { role };
      if (birthYear) {
        updateData.birth_year = parseInt(birthYear);
      }
      
      await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId);
    }

    if (!userId) {
      return NextResponse.redirect(new URL("/login?error=user_not_found", req.url));
    }

    // Create session and redirect
    const session = await createSession(userId);
    const res = NextResponse.redirect(new URL("/jobber", req.url));
    res.cookies.set(SESSION_COOKIE, session.token, COOKIE_OPTIONS);
    return res;

  } catch (err) {
    console.error("Vipps OAuth callback error:", err);
    return NextResponse.redirect(new URL("/login?error=internal_error", req.url));
  }
}