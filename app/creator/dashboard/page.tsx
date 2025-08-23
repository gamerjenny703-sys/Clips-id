// app/creator/dashboard/page.tsx

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  DollarSign,
  Users,
  Eye,
  TrendingUp,
  Clock,
  Trophy,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Jadikan ini sebagai Server Component yang dinamis
export default async function CreatorDashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // 1. Ambil semua kontes yang dibuat oleh user ini
  const { data: contests, error: contestsError } = await supabase
    .from("contests")
    .select(
      "id, title, prize_pool, status, end_date, submissions(id, view_count)",
    )
    .eq("creator_id", user.id);

  if (contestsError) {
    console.error("Error fetching contests:", contestsError);
    // Tampilkan halaman error atau state kosong jika gagal
  }

  // 2. Kalkulasi statistik dari data kontes
  const activeContests = contests?.filter((c) => c.status === "active") || [];
  const totalSubmissions =
    contests?.reduce((sum, c) => sum + c.submissions.length, 0) || 0;
  const totalViews =
    contests?.reduce(
      (sum, c) =>
        sum +
        c.submissions.reduce((subSum, s) => subSum + (s.view_count || 0), 0),
      0,
    ) || 0;
  const totalPrizePool =
    contests?.reduce((sum, c) => sum + Number(c.prize_pool || 0), 0) || 0;

  // 3. Ambil data submisi terbaru untuk "Recent Submissions"
  const { data: recentSubmissionsData } = await supabase
    .from("submissions")
    .select(
      `
      id,
      created_at,
      profiles(full_name),
      contests(title)
    `,
    )
    .in("contest_id", contests?.map((c) => c.id) || [])
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-white">
      {/* Header (statis, tidak berubah) */}
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black uppercase text-white">
                CREATOR DASHBOARD
              </h1>
              <p className="text-white font-bold">
                MANAGE YOUR CONTENT CLIPPING CONTESTS
              </p>
            </div>
            <Link href="/creator/contest/new">
              <Button className="bg-pink-500 text-white border-4 border-white hover:bg-white hover:text-black font-black uppercase shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                <Plus className="mr-2 h-4 w-4" />
                CREATE CONTEST
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Overview - Sekarang dinamis */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-4 border-black bg-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-black">
                Active Contests
              </CardTitle>
              <Trophy className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-black">
                {activeContests.length}
              </div>
              <p className="text-xs font-bold text-black">
                {/* DATA STATIS SEMENTARA: Perbandingan bulan lalu belum ada */}
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-black">
                Total Submissions
              </CardTitle>
              <Users className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-black">
                {totalSubmissions.toLocaleString()}
              </div>
              <p className="text-xs font-bold text-black">
                {/* DATA STATIS SEMENTARA: Perbandingan minggu ini belum ada */}
                +180 this week
              </p>
            </CardContent>
          </Card>

          <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-white">
                Total Views
              </CardTitle>
              <Eye className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-white">
                {(totalViews / 1000).toFixed(1)}K
              </div>
              <p className="text-xs font-bold text-white">
                {/* DATA STATIS SEMENTARA: Perbandingan minggu lalu belum ada */}
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-black">
                Prize Pool
              </CardTitle>
              <DollarSign className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-black">
                ${totalPrizePool.toLocaleString()}
              </div>
              <p className="text-xs font-bold text-black">
                Across all contests
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Contests - Sekarang dinamis */}
          <div className="lg:col-span-2">
            <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase text-black">
                  ACTIVE CONTESTS
                </CardTitle>
                <CardDescription className="font-bold text-black">
                  Monitor your ongoing content clipping contests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeContests.length > 0 ? (
                  activeContests.map((contest) => {
                    const timeLeftMs =
                      new Date(contest.end_date).getTime() -
                      new Date().getTime();
                    const timeLeftDays = Math.ceil(
                      timeLeftMs / (1000 * 60 * 60 * 24),
                    );
                    // DATA STATIS SEMENTARA: Progress bar belum memiliki data
                    const progress = 75;

                    return (
                      <div
                        key={contest.id}
                        className="border-4 border-black rounded-lg p-4 bg-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg">
                              {contest.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />$
                                {Number(contest.prize_pool).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {contest.submissions.length} submissions
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {timeLeftDays > 0
                                  ? `${timeLeftDays} days left`
                                  : "Ending soon"}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              timeLeftDays < 3 ? "destructive" : "default"
                            }
                            className="font-bold"
                          >
                            {timeLeftDays < 3 ? "ENDING SOON" : "ACTIVE"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Link href={`/creator/contest/${contest.id}/manage`}>
                            <Button
                              size="sm"
                              className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                            >
                              VIEW SUBMISSIONS
                            </Button>
                          </Link>
                          {/* Tombol Edit Contest belum ada fungsionalitasnya */}
                          <Button
                            size="sm"
                            className="bg-yellow-400 text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                          >
                            EDIT CONTEST
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center font-bold p-4">
                    You have no active contests.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Submissions - Sekarang dinamis */}
            <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-black">
                  RECENT SUBMISSIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSubmissionsData && recentSubmissionsData.length > 0 ? (
                  recentSubmissionsData.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-start gap-3 p-3 border border-border rounded-lg bg-muted/50"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {submission.profiles?.full_name?.substring(0, 2) ||
                            "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {submission.profiles?.full_name || "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {submission.contests?.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {/* DATA STATIS SEMENTARA: Engagement (likes, comments, shares) belum diambil di query ini */}
                          <span className="flex items-center gap-1">
                            {" "}
                            <Heart className="h-3 w-3" /> 12{" "}
                          </span>
                          <span className="flex items-center gap-1">
                            {" "}
                            <MessageCircle className="h-3 w-3" /> 3{" "}
                          </span>
                          <span className="flex items-center gap-1">
                            {" "}
                            <Share2 className="h-3 w-3" /> 1{" "}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(submission.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center font-bold p-4">
                    No recent submissions to your contests.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions (statis, tidak berubah) */}
            <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-white">
                  QUICK ACTIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-black text-white border-4 border-white hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  <Plus className="mr-2 h-4 w-4" />
                  CREATE NEW CONTEST
                </Button>
                <Button className="w-full justify-start bg-white text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  VIEW ANALYTICS
                </Button>
                <Button className="w-full justify-start bg-cyan-400 text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <DollarSign className="mr-2 h-4 w-4" />
                  MANAGE PAYMENTS
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
