// app/api/auth/youtube/route.ts

import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error?error=missing_code`);
  }

  const supabase = createClient();

  // Ambil user yang sedang login untuk menautkan koneksi
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/error?error=user_not_found`);
  }

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
    if (!profileResponse.ok) throw new Error("Failed to fetch user profile");

    const channel = profileData.items[0];

    // --- LOGIKA PENYIMPANAN KE DATABASE ---
    const { error: upsertError } = await supabase
      .from("social_connections")
      .upsert(
        {
          user_id: user.id,
          platform: "youtube",
          platform_user_id: channel.id,
          username: channel.snippet.customUrl || channel.snippet.title,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token, // Mungkin null jika access_type offline dinonaktifkan
        },
        { onConflict: "user_id, platform" },
      ); // `upsert` akan meng-update jika sudah ada

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
      throw new Error("Failed to save social connection to database.");
    }

    console.log(
      "[v0] YouTube connection successful and saved for user:",
      user.id,
    );

    // Redirect kembali ke halaman settings untuk feedback langsung
    return NextResponse.redirect(`${origin}/user/settings?connected=youtube`);
  } catch (error) {
    console.error("[v0] YouTube OAuth error:", error);
    return NextResponse.redirect(`${origin}/auth/error?error=oauth_failed`);
  }
}

// --- FUNGSI POST TETAP SAMA, TIDAK ADA PERUBAHAN ---
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

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
    authUrl.searchParams.set("state", userId || "anonymous");
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
