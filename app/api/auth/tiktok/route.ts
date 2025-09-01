// app/api/auth/tiktok/route.ts

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/auth/error?error=missing_params`);
  }

  const userId = state;
  const supabaseAdmin = createAdminClient();

  try {
    const tokenResponse = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_key: process.env.TIKTOK_CLIENT_KEY!,
          client_secret: process.env.TIKTOK_CLIENT_SECRET!,
          code,
          grant_type: "authorization_code",
          redirect_uri: `${origin}/api/auth/tiktok`,
        }),
      },
    );

    const tokenData = await tokenResponse.json();
    if (
      !tokenResponse.ok ||
      (tokenData.error &&
        tokenData.error.code !== "ok" &&
        tokenData.error.error)
    ) {
      console.error("TikTok Token Exchange Error:", tokenData);
      throw new Error(
        tokenData.error_description || "Failed to exchange code for tokens",
      );
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    const profileResponse = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const profileData = await profileResponse.json();
    if (
      !profileResponse.ok ||
      (profileData.error && profileData.error.code !== "ok")
    ) {
      console.error("TikTok Profile Fetch Error:", profileData);
      throw new Error("Failed to fetch user profile from TikTok");
    }

    const tiktokUser = profileData.data.user;

    const { error: upsertError } = await supabaseAdmin
      .from("social_connections")
      .upsert(
        {
          user_id: userId,
          platform: "tiktok",
          platform_user_id: tiktokUser.open_id,
          username: tiktokUser.username || tiktokUser.display_name,
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        { onConflict: "user_id, platform" },
      );

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
      throw new Error("Failed to save TikTok connection to database.");
    }

    console.log(
      "[v0] TikTok connection successful and saved for user:",
      userId,
    );
    return NextResponse.redirect(`${origin}/user/settings?connected=tiktok`);
  } catch (error) {
    console.error("!!! ERROR in TikTok OAuth Flow:", error);
    return NextResponse.redirect(`${origin}/auth/error?error=oauth_failed`);
  }
}

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/auth/tiktok`;
  const supabase = createServerClient(); // Menggunakan nama alias
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 },
    );
  }

  try {
    const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
    authUrl.searchParams.set("client_key", process.env.TIKTOK_CLIENT_KEY!);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "user.info.basic,user.info.profile");
    authUrl.searchParams.set("state", user.id);

    return NextResponse.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error("[v0] TikTok OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth" },
      { status: 500 },
    );
  }
}
