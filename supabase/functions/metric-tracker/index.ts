// supabase/functions/metric-tracker/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/functions-js@2.4.1";

// Helper function untuk mengekstrak Video ID dari URL YouTube
function getYouTubeVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("CUSTOM_SUPABASE_URL")!,
      Deno.env.get("CUSTOM_SERVICE_ROLE_KEY")!,
    );
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");

    // Ambil submisi dari kontes yang aktif, dan sertakan data rules kontesnya
    const { data: submissions, error } = await supabase
      .from("submissions")
      .select(
        `
        id,
        video_url,
        platform,
        clipper_id,
        contests (
          id,
          status,
          rules,
          prize_pool
        )
      `,
      )
      .eq("contests.status", "active");

    if (error) throw error;

    console.log(`Found ${submissions.length} active submissions.`);

    for (const submission of submissions) {
      // Lewati jika data kontes tidak ada
      if (!submission.contests) continue;

      let newViewCount = 0;
      let newLikeCount = 0;

      // === BAGIAN PENGAMBILAN METRIK (YANG SUDAH ADA) ===
      if (submission.platform.toLowerCase() === "youtube") {
        const videoId = getYouTubeVideoId(submission.video_url);
        if (videoId) {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`,
          );
          if (!response.ok) {
            console.error(
              `YouTube API error for video ${videoId}:`,
              await response.text(),
            );
            continue; // Lanjut ke submisi berikutnya
          }
          const videoData = await response.json();
          const stats = videoData.items?.[0]?.statistics;

          if (stats) {
            newViewCount = parseInt(stats.viewCount || "0", 10);
            newLikeCount = parseInt(stats.likeCount || "0", 10);
          }
        }
      }
      // Nanti tambahkan 'else if' untuk TikTok, Twitter, dll. di sini

      // === UPDATE DATABASE DENGAN METRIK BARU ===
      const { error: updateError } = await supabase
        .from("submissions")
        .update({
          view_count: newViewCount,
          like_count: newLikeCount,
          last_synced_at: new Date().toISOString(),
        })
        .eq("id", submission.id);

      if (updateError) {
        console.error(
          `Failed to update submission ${submission.id}:`,
          updateError.message,
        );
        continue;
      }
      console.log(
        `Updated metrics for submission ${submission.id}. Views: ${newViewCount}`,
      );

      // === BAGIAN BARU: LOGIKA PENENTUAN PEMENANG ===
      const contestRules = submission.contests.rules as any;
      const winCondition = contestRules?.win_condition;

      if (
        winCondition?.metric === "view_count" &&
        newViewCount >= winCondition.target
      ) {
        console.log(`Submission ${submission.id} has met the win condition!`);

        // 1. Catat pemenangnya di tabel 'contest_winners'
        const { error: winnerError } = await supabase
          .from("contest_winners")
          .insert({
            contest_id: submission.contests.id,
            winner_id: submission.clipper_id,
            rank: 1, // Untuk sekarang kita asumsikan juara 1
            prize_awarded: submission.contests.prize_pool, // Asumsi winner_takes_all
          });

        if (winnerError) {
          console.error(
            `Failed to record winner for contest ${submission.contests.id}:`,
            winnerError.message,
          );
        } else {
          console.log(
            `Winner for contest ${submission.contests.id} recorded successfully!`,
          );

          // 2. Jika aturan 'winner_takes_all', akhiri kontesnya
          if (contestRules?.payout?.type === "winner_takes_all") {
            const { error: contestUpdateError } = await supabase
              .from("contests")
              .update({ status: "ended" })
              .eq("id", submission.contests.id);

            if (contestUpdateError) {
              console.error(
                `Failed to end contest ${submission.contests.id}:`,
                contestUpdateError.message,
              );
            } else {
              console.log(`Contest ${submission.contests.id} has been ended.`);
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ message: `Metric sync and winner check completed.` }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    console.error("Fatal error in Metric Tracker function:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
