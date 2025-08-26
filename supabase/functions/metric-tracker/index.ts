import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

type ContestRules = {
  win_condition: {
    metric: "view_count" | "like_count" | "comment_count" | "share_count";
    target: number;
  };
};

function getYouTubeVideoId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getTikTokVideoId(url: string): string | null {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
}

async function getValidTikTokToken(supabase: SupabaseClient): Promise<string> {
  console.log("Checking TikTok token validity...");

  const { data: tokenData, error: selectError } = await supabase
    .from("app_config")
    .select("value, updated_at")
    .eq("key", "tiktok_access_token")
    .single();

  if (selectError || !tokenData) {
    throw new Error(
      "Could not fetch TikTok token from config. Please ensure it was inserted manually for the first time.",
    );
  }

  const lastUpdated = new Date(tokenData.updated_at);
  const tokenAgeInSeconds =
    (new Date().getTime() - lastUpdated.getTime()) / 1000;

  if (tokenAgeInSeconds > 5400) {
    // Refresh if older than 1.5 hours
    console.log("TikTok token is old or expired. Refreshing now...");
    const clientKey = Deno.env.get("TIKTOK_CLIENT_KEY");
    const clientSecret = Deno.env.get("TIKTOK_CLIENT_SECRET");
    if (!clientKey || !clientSecret)
      throw new Error(
        "TikTok client credentials are not set in Supabase Secrets.",
      );

    const response = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_key: clientKey,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        }),
      },
    );

    const newTokenData = await response.json();
    if (!newTokenData.access_token) {
      console.error("Failed to refresh TikTok token. Response:", newTokenData);
      throw new Error("Failed to get new access_token from TikTok.");
    }

    const newAccessToken = newTokenData.access_token;

    await supabase
      .from("app_config")
      .update({ value: newAccessToken, updated_at: new Date().toISOString() })
      .eq("key", "tiktok_access_token");

    console.log(
      "Successfully refreshed and updated TikTok token in the database.",
    );
    return newAccessToken;
  }

  console.log("Existing TikTok token is still valid.");
  return tokenData.value;
}

// --- FUNGSI UTAMA (SERVE) YANG SUDAH DIPERBARUI ---
serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const TIKTOK_ACCESS_TOKEN = await getValidTikTokToken(supabase);
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY")!;

    const { data: submissions, error } = await supabase
      .from("submissions")
      .select(
        `id, video_url, platform, clipper_id, contest_id, contests ( status, rules, prize_pool )`,
      )
      .eq("contests.status", "active")
      .eq("status", "approved");

    if (error) throw error;
    if (!submissions || submissions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active submissions to track." }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    console.log(`Found ${submissions.length} active submissions to track.`);

    const processingPromises = submissions.map(async (submission) => {
      let metricsToUpdate: { [key: string]: number } | null = null;
      const platform = submission.platform.toLowerCase();

      try {
        if (platform === "youtube") {
          const videoId = getYouTubeVideoId(submission.video_url);
          if (videoId) {
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
          }
        } else if (platform === "tiktok") {
          const videoId = getTikTokVideoId(submission.video_url);
          if (videoId) {
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
            }
          }
        }

        if (metricsToUpdate) {
          await supabase
            .from("submissions")
            .update({
              ...metricsToUpdate,
              last_synced_at: new Date().toISOString(),
            })
            .eq("id", submission.id);

          console.log(
            `Successfully updated metrics for submission ${submission.id}`,
          );

          const contestRules = submission.contests.rules as ContestRules;
          const winMetric = contestRules.win_condition.metric;
          const winTarget = contestRules.win_condition.target;

          if (
            winMetric in metricsToUpdate &&
            metricsToUpdate[winMetric] >= winTarget
          ) {
            console.log(`WINNER FOUND for contest ${submission.contest_id}!`);

            await supabase.from("contest_winners").insert({
              contest_id: submission.contest_id,
              winner_id: submission.clipper_id,
              prize_awarded: submission.contests.prize_pool,
              rank: 1, // Asumsi juara 1 untuk sekarang
            });

            await supabase.rpc("increment_balance", {
              user_id_input: submission.clipper_id,
              amount_input: submission.contests.prize_pool,
            });
            await supabase
              .from("contests")
              .update({ status: "completed" })
              .eq("id", submission.contest_id);
            return { status: "winner", contestId: submission.contest_id };
          }
          return { status: "updated", submissionId: submission.id };
        }
      } catch (e) {
        console.error(
          `Failed to process submission ${submission.id}:`,
          e.message,
        );
        return {
          status: "failed",
          submissionId: submission.id,
          error: e.message,
        };
      }
      return { status: "no_update", submissionId: submission.id };
    });

    const results = await Promise.all(processingPromises);

    const updatedCount = results.filter((r) => r?.status === "updated").length;
    const winnersFound = results.filter((r) => r?.status === "winner").length;

    return new Response(
      JSON.stringify({
        message: `Processing complete. Updated ${updatedCount} submissions. Found ${winnersFound} new winners.`,
        results,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("FATAL ERROR in Metric Tracker function:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
