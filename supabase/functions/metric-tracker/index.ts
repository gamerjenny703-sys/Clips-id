// supabase/functions/metric-tracker/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "supabase-functions";

// Tipe data untuk aturan kontes
type ContestRules = {
  win_condition: {
    metric: "view_count" | "like_count" | "comment_count" | "share_count";
    target: number;
  };
};

// Helper function untuk YouTube
function getYouTubeVideoId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// --- HELPER FUNCTION BARU UNTUK TIKTOK ---
// Fungsi ini mengekstrak ID video dari URL TikTok
function getTikTokVideoId(url: string): string | null {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
}

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    const TIKTOK_ACCESS_TOKEN = Deno.env.get("TIKTOK_ACCESS_TOKEN");

    if (!YOUTUBE_API_KEY || !TIKTOK_ACCESS_TOKEN) {
      throw new Error("API keys for YouTube or TikTok are not set.");
    }

    const { data: submissions, error } = await supabase
      .from("submissions")
      .select(
        `
        id, video_url, platform, clipper_id, contest_id,
        contests ( status, rules, prize_pool )
      `,
      )
      .eq("contests.status", "active");

    if (error) throw error;
    console.log(`Found ${submissions.length} active submissions to track.`);

    const processedSubmissions = [];
    const contestsWithNewWinners = new Set<number>();

    for (const submission of submissions) {
      if (contestsWithNewWinners.has(submission.contest_id)) continue;

      let metricsToUpdate: { [key: string]: number } | null = null;
      const platform = submission.platform.toLowerCase();

      // --- LOGIKA PERCABANGAN UNTUK SETIAP PLATFORM ---
      if (platform === "youtube") {
        const videoId = getYouTubeVideoId(submission.video_url);
        if (!videoId) continue;

        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const stats = data.items[0].statistics;
          metricsToUpdate = {
            view_count: parseInt(stats.viewCount || "0", 10),
            like_count: parseInt(stats.likeCount || "0", 10),
            comment_count: parseInt(stats.commentCount || "0", 10),
          };
        }
      } else if (platform === "tiktok") {
        const videoId = getTikTokVideoId(submission.video_url);
        if (!videoId) {
          console.warn(
            `Could not extract TikTok video ID from URL: ${submission.video_url}`,
          );
          continue;
        }

        const apiUrl = "https://open.tiktokapis.com/v2/video/query/";
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TIKTOK_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filters: { video_ids: [videoId] },
            fields: [
              "id",
              "view_count",
              "like_count",
              "comment_count",
              "share_count",
            ],
          }),
        });

        const data = await response.json();

        if (data.data && data.data.videos && data.data.videos.length > 0) {
          const stats = data.data.videos[0];
          metricsToUpdate = {
            view_count: stats.view_count || 0,
            like_count: stats.like_count || 0,
            comment_count: stats.comment_count || 0,
            share_count: stats.share_count || 0,
          };
        } else {
          console.warn(
            `No data found for TikTok video ID ${videoId}:`,
            data.error.message,
          );
        }
      }

      // --- Lanjutan: Update & Cek Pemenang (logika ini sama untuk semua platform) ---
      if (metricsToUpdate) {
        const { error: updateError } = await supabase
          .from("submissions")
          .update(metricsToUpdate)
          .eq("id", submission.id);

        if (updateError) {
          console.error(
            `Failed to update submission ${submission.id}:`,
            updateError.message,
          );
          continue;
        }

        console.log(
          `Successfully updated metrics for submission ${submission.id} from ${platform}`,
        );
        processedSubmissions.push(submission.id);

        const contestRules = submission.contests.rules as ContestRules;
        const winMetric = contestRules.win_condition.metric;
        const winTarget = contestRules.win_condition.target;

        if (
          winMetric in metricsToUpdate &&
          metricsToUpdate[winMetric] >= winTarget
        ) {
          // ... (Logika memasukkan pemenang dan update kontes tetap sama seperti sebelumnya) ...
          console.log(`WINNER FOUND for contest ${submission.contest_id}!`);
          await supabase.from("contest_winners").insert({
            /* ... */
          });
          await supabase
            .from("contests")
            .update({ status: "completed" })
            .eq("id", submission.contest_id);
          contestsWithNewWinners.add(submission.contest_id);
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "Processing complete." /* ... */ }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err) {
    console.error("Error in Metric Tracker function:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
