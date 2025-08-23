// app/api/submissions/create/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper untuk mengekstrak ID video dari URL
function getYouTubeVideoId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contestId, platform, video_url } = await request.json();
    if (!contestId || !platform || !video_url) {
      return NextResponse.json(
        { error: "Missing submission data" },
        { status: 400 },
      );
    }

    // --- LOGIKA VERIFIKASI KEPEMILIKAN ---
    console.log(`Verifying ownership for platform: ${platform}`);

    // 1. Ambil koneksi sosial pengguna untuk platform terkait
    const { data: socialConnection, error: connError } = await supabase
      .from("social_connections")
      .select("platform_user_id, access_token")
      .eq("user_id", user.id)
      .eq("platform", platform.toLowerCase())
      .single();

    if (connError || !socialConnection) {
      throw new Error(`User does not have a connected ${platform} account.`);
    }

    let isOwner = false;

    // 2. Lakukan pengecekan berdasarkan platform
    if (platform.toLowerCase() === "youtube") {
      const videoId = getYouTubeVideoId(video_url);
      if (!videoId) throw new Error("Invalid YouTube URL.");

      // Panggil YouTube API menggunakan access_token pengguna
      const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Gunakan API Key server jika access token tidak cukup
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const videoOwnerChannelId = data.items[0].snippet.channelId;
        // Bandingkan Channel ID video dengan Channel ID yang tersimpan saat user konek
        if (videoOwnerChannelId === socialConnection.platform_user_id) {
          isOwner = true;
        }
      }
    }
    // TODO: Tambahkan logika untuk TikTok di sini
    else if (platform.toLowerCase() === "tiktok") {
      // Untuk TikTok, API verifikasi kepemilikan mungkin memerlukan scope berbeda.
      // Untuk sekarang, kita anggap lolos untuk testing.
      console.log(
        "TikTok ownership verification is not yet implemented. Assuming success for now.",
      );
      isOwner = true;
    }

    if (!isOwner) {
      return NextResponse.json(
        {
          error: `Verification failed. The submitted video does not belong to your connected ${platform} account.`,
        },
        { status: 403 },
      );
    }

    // 3. Jika verifikasi berhasil, simpan submisi ke database
    console.log("Ownership verified. Inserting submission into database...");
    const { data: newSubmission, error: insertError } = await supabase
      .from("submissions")
      .insert({
        contest_id: contestId,
        clipper_id: user.id,
        platform: platform,
        video_url: video_url,
        status: "pending_relevance_check", // Status baru setelah lolos cek kepemilikan
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      status: "success",
      message: "Submission successful and awaiting relevance check.",
      data: newSubmission,
    });
  } catch (error: any) {
    console.error("Submission Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
