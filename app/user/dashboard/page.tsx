//app/user/dashboard/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Trophy,
  Clock,
  Eye,
  Upload,
  Star,
  Youtube,
  Instagram, // Seharusnya ini ikon TikTok, bisa disesuaikan nanti
  Twitter,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import UnsaveContestButton from "@/components/features/contest/UnsaveContestButton";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function UserDashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // --- Mengambil semua data yang dibutuhkan secara paralel ---
  const profileReq = supabase
    .from("profiles")
    .select("is_creator")
    .eq("id", user.id)
    .single();

  const winsReq = supabase
    .from("contest_winners")
    .select("prize_awarded, awarded_at")
    .eq("winner_id", user.id);

  const allSubmissionsReq = supabase
    .from("submissions")
    .select(
      "id, view_count, like_count, comment_count, share_count, contest_id, created_at, contests(title)",
    )
    .eq("clipper_id", user.id)
    .order("created_at", { ascending: false });

  const savedContestsReq = supabase
    .from("saved_contests")
    .select(`contests (*, profiles!contests_creator_id_fkey(full_name))`)
    .eq("user_id", user.id);

  const socialConnectionsReq = supabase
    .from("social_connections")
    .select("platform, username")
    .eq("user_id", user.id);

  const [
    { data: profile },
    { data: wins },
    { data: allSubmissions },
    { data: savedContestsData },
    { data: socialConnections },
  ] = await Promise.all([
    profileReq,
    winsReq,
    allSubmissionsReq,
    savedContestsReq,
    socialConnectionsReq,
  ]);

  // --- Kalkulasi Statistik ---
  const totalEarnings =
    wins?.reduce((sum, win) => sum + Number(win.prize_awarded), 0) ?? 0;
  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
  const monthlyEarnings =
    wins
      ?.filter((win) => new Date(win.awarded_at) > thirtyDaysAgo)
      .reduce((sum, win) => sum + Number(win.prize_awarded), 0) ?? 0;

  const contestsWonCount = wins?.length ?? 0;
  const contestsJoinedCount = allSubmissions
    ? new Set(allSubmissions.map((s) => s.contest_id)).size
    : 0;
  const winRate =
    contestsJoinedCount > 0
      ? Math.round((contestsWonCount / contestsJoinedCount) * 100)
      : 0;

  const activeSubmissionsCount = allSubmissions?.length ?? 0;
  const activeContestsCount = contestsJoinedCount;

  const totalViews =
    allSubmissions?.reduce((sum, s) => sum + (s.view_count || 0), 0) ?? 0;

  // --- Olah data untuk ditampilkan ---
  const savedContests =
    savedContestsData?.map((item) => item.contests).filter(Boolean) ?? [];
  const recentSubmissions = allSubmissions?.slice(0, 3) ?? [];

  const availablePlatforms = [
    { name: "YouTube", icon: Youtube },
    { name: "TikTok", icon: Instagram }, // NOTE: Ganti dengan ikon TikTok jika ada
    { name: "Twitter", icon: Twitter },
  ];

  const socialAccounts = availablePlatforms.map((p) => {
    const connection = socialConnections?.find(
      (sc) => sc.platform.toLowerCase() === p.name.toLowerCase(),
    );
    return { ...p, connected: !!connection, username: connection?.username };
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back Arrow to Home */}
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-8 w-8 text-white hover:text-yellow-400" />
              </Link>

              <div>
                <h1 className="text-4xl font-black uppercase text-white">
                  CLIPPER DASHBOARD
                </h1>
                <p className="text-white font-bold">
                  FIND CONTESTS, SUBMIT CLIPS, AND EARN REWARDS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Badge className="border-4 border-white bg-yellow-400 text-black font-black uppercase">
                <Star className="mr-1 h-3 w-3 fill-black text-black" />
                CLIPPER
              </Badge>
              <Link href="/user/submit-clip/1">
                <Button className="bg-pink-500 text-white border-4 border-white hover:bg-white hover:text-black font-black uppercase shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                  <Upload className="mr-2 h-4 w-4" />
                  SUBMIT CLIP
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-white">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-white">
                ${totalEarnings.toLocaleString()}
              </div>
              <p className="text-xs font-bold text-white">
                +${monthlyEarnings.toLocaleString()} this month
              </p>
            </CardContent>
          </Card>
          <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-black">
                Contests Won
              </CardTitle>
              <Trophy className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-black">
                {contestsWonCount}
              </div>
              <p className="text-xs font-bold text-black">
                {winRate}% win rate
              </p>
            </CardContent>
          </Card>
          <Card className="border-4 border-black bg-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-black">
                Active Submissions
              </CardTitle>
              <Clock className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-black">
                {activeSubmissionsCount}
              </div>
              <p className="text-xs font-bold text-black">
                in {activeContestsCount} contests
              </p>
            </CardContent>
          </Card>
          <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-black">
                Total Views
              </CardTitle>
              <Eye className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-black">
                {(totalViews / 1000).toFixed(1)}K
              </div>
              <p className="text-xs font-bold text-black">Across all clips</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SAVED CONTESTS */}
          <div className="lg:col-span-2">
            <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase text-black">
                  SAVED CONTESTS
                </CardTitle>
                <CardDescription className="font-bold text-black">
                  Your bookmarked contests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedContests.length > 0 ? (
                  savedContests.map((contest: any) => (
                    <div
                      key={contest.id}
                      className="border-4 border-black rounded-lg p-4 bg-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <h3 className="font-bold text-lg text-black">
                        {contest.title}
                      </h3>
                      <p className="text-sm">
                        by {contest.profiles?.full_name || "Creator"}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-black">
                          ${contest.prize_pool}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link href={`/work/${contest.id}`}>
                            <Button
                              size="sm"
                              className="bg-pink-500 text-white border-4 border-black hover:bg-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                              VIEW
                            </Button>
                          </Link>
                          <UnsaveContestButton contestId={contest.id} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="font-bold text-center text-black">
                    You have no saved contests.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* SOCIAL ACCOUNTS */}
            {/*<Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-black">
                  SOCIAL ACCOUNTS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {socialAccounts.map((account) => (
                  <div
                    key={account.name}
                    className="flex items-center justify-between p-3 border border-black rounded-lg bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <account.icon className="h-5 w-5" />
                      <div>
                        <p className="font-medium text-sm">{account.name}</p>
                        {account.connected && (
                          <p className="text-xs text-black">
                            {account.username}
                          </p>
                        )}
                      </div>
                    </div>
                    {account.connected ? (
                      <CheckCircle className="h-4 w-4 text-black" />
                    ) : (
                      <Link href="/user/settings">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-4 border-black text-xs bg-transparent"
                        >
                          Connect
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>*/}

            {/* RECENT SUBMISSIONS */}
            <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-white">
                  RECENT SUBMISSIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSubmissions.length > 0 ? (
                  recentSubmissions.map((submission: any) => (
                    <div
                      key={submission.id}
                      className="p-3 border border-black rounded-lg bg-white"
                    >
                      <p className="font-medium text-sm truncate">
                        {submission.contests?.title || "Contest"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-black mt-1">
                        <span>
                          {formatDistanceToNow(
                            new Date(submission.created_at),
                            { addSuffix: true },
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {submission.view_count?.toLocaleString() ?? 0}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="font-bold text-center text-white">
                    You haven't submitted any clips yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
