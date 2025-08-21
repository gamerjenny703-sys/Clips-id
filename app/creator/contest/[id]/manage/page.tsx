// app/creator/contest/[id]/manage/page.tsx

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  DollarSign,
  Play,
  Pause,
  Edit,
  Star,
  Flag,
  Download,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";

// Jadikan ini Server Component yang dinamis
export default async function ManageContestPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const contestId = Number(params.id);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  // 1. Ambil data kontes spesifik DAN semua submisi terkait
  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .select(
      `
      id,
      title,
      description,
      prize_pool,
      status,
      end_date,
      created_at,
      creator_id,
      submissions (
        id,
        created_at,
        video_url,
        view_count,
        like_count,
        comment_count,
        share_count,
        profiles (
          full_name,
          username
        )
      )
    `,
    )
    .eq("id", contestId)
    .single();

  if (contestError || !contest || contest.creator_id !== user.id) {
    // Pastikan hanya kreator yang benar yang bisa mengakses
    return notFound();
  }

  // 2. Kalkulasi statistik dari data yang diambil
  const submissions = contest.submissions || [];
  const totalParticipants = new Set(
    submissions.map((s) => s.profiles?.username),
  ).size;
  const totalSubmissionsCount = submissions.length;

  const totalViews = submissions.reduce(
    (sum, s) => sum + (s.view_count || 0),
    0,
  );
  // DATA STATIS SEMENTARA: Metrik ini memerlukan query atau kalkulasi lebih kompleks
  const totalEngagement = submissions.reduce(
    (sum, s) => sum + (s.like_count || 0) + (s.comment_count || 0),
    0,
  );
  const avgScore = 88;

  const timeLeft = contest.end_date
    ? formatDistanceToNowStrict(new Date(contest.end_date), { addSuffix: true })
    : "No limit";

  // DATA STATIS SEMENTARA: Progress bar belum memiliki data
  const progress = 75;

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Sekarang dinamis */}
      <header className="border-b-4 border-black bg-pink-500">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/creator/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-4 border-black bg-white hover:bg-yellow-400 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-black text-white uppercase">
                  {contest.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-pink-100 mt-1 font-bold">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />$
                    {Number(contest.prize_pool).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {totalParticipants} participants
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={contest.status === "active" ? "default" : "secondary"}
                className="font-black uppercase border-2 border-black bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                {contest.status.toUpperCase()}
              </Badge>
              {/* DATA STATIS SEMENTARA: Fungsionalitas tombol-tombol ini belum dibuat */}
              <Button
                variant="outline"
                className="border-4 border-black bg-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-400"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Contest
              </Button>
              <Button
                variant="secondary"
                className="font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black bg-yellow-400 text-black hover:bg-yellow-300"
              >
                {contest.status === "active" ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Pause Contest
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Resume Contest
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Contest Progress - Sekarang dinamis */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black uppercase">Contest Progress</h3>
              <span className="text-sm font-bold">{progress}% complete</span>
            </div>
            <Progress
              value={progress}
              className="h-4 mb-4 border-2 border-black"
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-pink-500 text-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black">
                  {totalSubmissionsCount}
                </div>
                <div className="text-sm font-bold uppercase">
                  Total Submissions
                </div>
              </div>
              <div className="bg-yellow-400 text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black">
                  {totalViews.toLocaleString()}
                </div>
                <div className="text-sm font-bold uppercase">Total Views</div>
              </div>
              <div className="bg-cyan-400 text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black">
                  {totalEngagement.toLocaleString()}
                </div>
                <div className="text-sm font-bold uppercase">
                  Total Engagement
                </div>
              </div>
              <div className="bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black">{avgScore}</div>
                <div className="text-sm font-bold uppercase">Avg Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs - Bagian Submissions & Leaderboard dinamis, sisanya statis */}
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <TabsTrigger
              value="submissions"
              className="font-black uppercase data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              Submissions ({totalSubmissionsCount})
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="font-black uppercase data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="font-black uppercase data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="font-black uppercase data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Submissions Tab - Dinamis */}
          <TabsContent value="submissions" className="space-y-4">
            {submissions.map((submission) => (
              <Card
                key={submission.id}
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
              >
                <CardContent className="p-6">
                  {/* ... (Konten kartu submisi diisi dengan data dari 'submission') ... */}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Leaderboard Tab - Dinamis */}
          <TabsContent value="leaderboard">
            <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase">
                  Current Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions
                    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                    .map((submission, index) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 border border-black rounded-lg bg-card"
                      >
                        {/* ... (Konten leaderboard diisi dengan data dari 'submission') ... */}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DATA STATIS SEMENTARA: Analytics & Settings Tab */}
          <TabsContent value="analytics">
            {/* ... Konten statis analytics dari file asli ... */}
          </TabsContent>
          <TabsContent value="settings">
            {/* ... Konten statis settings dari file asli ... */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
