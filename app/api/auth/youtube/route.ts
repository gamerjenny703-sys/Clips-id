// app/api/auth/youtube/route.ts

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // Mengambil user_id dari state

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/auth/error?error=missing_params`);
  }

  const userId = state;
  const supabaseAdmin = createAdminClient();

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID!,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.APP_URL}/api/auth/youtube`,
        code_verifier: "challenge",
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error("Google Token Exchange Error:", tokens);
      throw new Error(
        tokens.error_description || "Failed to exchange code for tokens",
      );
    }

    const profileResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );
    const profileData = await profileResponse.json();
    if (
      !profileResponse.ok ||
      !profileData.items ||
      profileData.items.length === 0
    ) {
      console.error("Google Profile Fetch Error:", profileData);
      throw new Error("Failed to fetch user profile from YouTube");
    }

    const channel = profileData.items[0];

    const { error: upsertError } = await supabaseAdmin
      .from("social_connections")
      .upsert(
        {
          user_id: userId,
          platform: "youtube",
          platform_user_id: channel.id,
          username: channel.snippet.customUrl || channel.snippet.title,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        },
        { onConflict: "user_id, platform" },
      );

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
      throw new Error("Failed to save social connection to database.");
    }

    console.log(
      "[v0] YouTube connection successful and saved for user:",
      userId,
    );
    return NextResponse.redirect(`${origin}/user/settings?connected=youtube`);
  } catch (error) {
    console.error("!!! ERROR in YouTube OAuth Flow:", error);
    return NextResponse.redirect(`${origin}/auth/error?error=oauth_failed`);
  }
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
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
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", process.env.YOUTUBE_CLIENT_ID!);
    authUrl.searchParams.set(
      "redirect_uri",
      `${process.env.APP_URL}/api/auth/youtube`,
    );
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set(
      "scope",
      "https://www.googleapis.com/auth/youtube.readonly",
    );
    authUrl.searchParams.set("prompt", "consent");
    authUrl.searchParams.set("state", user.id); // MENGIRIM user.id SEBAGAI STATE
    authUrl.searchParams.set("code_challenge", "challenge");
    authUrl.searchParams.set("code_challenge_method", "plain");

    return NextResponse.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error("[v0] YouTube OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth" },
      { status: 500 },
    );
  }
}
