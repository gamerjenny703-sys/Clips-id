// Script to periodically sync metrics from social media APIs
const syncAllMetrics = async () => {
  try {
    console.log("[v0] Starting metrics sync...");

    // Fetch all active submissions that need metric updates
    const activeSubmissions = [
      {
        userId: "user1",
        contestId: "contest1",
        platform: "youtube",
        contentUrl: "https://youtube.com/watch?v=123",
      },
      {
        userId: "user2",
        contestId: "contest1",
        platform: "tiktok",
        contentUrl: "https://tiktok.com/@user/video/456",
      },
      {
        userId: "user3",
        contestId: "contest2",
        platform: "twitter",
        contentUrl: "https://twitter.com/user/status/789",
      },
    ];

    const syncResults = [];

    for (const submission of activeSubmissions) {
      try {
        // Call the sync API for each submission
        const response = await fetch("/api/progress/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });

        const result = await response.json();
        syncResults.push({ ...submission, result });

        console.log(
          `[v0] Synced metrics for ${submission.platform} submission:`,
          result,
        );

        // Add delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(
          `[v0] Failed to sync metrics for submission:`,
          submission,
          error,
        );
      }
    }

    console.log("[v0] Metrics sync completed. Results:", syncResults);

    // Update rankings and send notifications if needed
    await updateRankingsAndNotify(syncResults);

    return syncResults;
  } catch (error) {
    console.error("[v0] Error in metrics sync:", error);
    throw error;
  }
};

const updateRankingsAndNotify = async (syncResults) => {
  // Group results by contest
  const contestGroups = syncResults.reduce((groups, result) => {
    const contestId = result.contestId;
    if (!groups[contestId]) groups[contestId] = [];
    groups[contestId].push(result);
    return groups;
  }, {});

  // Update rankings for each contest
  for (const [contestId, results] of Object.entries(contestGroups)) {
    console.log(`[v0] Updating rankings for contest ${contestId}`);

    // Sort by engagement score and update ranks
    const sortedResults = results.sort(
      (a, b) => b.result.engagementScore - a.result.engagementScore,
    );

    for (let i = 0; i < sortedResults.length; i++) {
      const result = sortedResults[i];
      const newRank = i + 1;
      const previousRank = result.result.rank || newRank;

      if (newRank !== previousRank) {
        console.log(
          `[v0] Rank change for user ${result.userId}: ${previousRank} → ${newRank}`,
        );

        // Send notification about rank change
        // This would typically send push notifications, emails, etc.
      }
    }
  }
};

// Run the sync
syncAllMetrics()
  .then((results) => {
    console.log(
      "[v0] Sync completed successfully:",
      results.length,
      "submissions processed",
    );
  })
  .catch((error) => {
    console.error("[v0] Sync failed:", error);
  });
