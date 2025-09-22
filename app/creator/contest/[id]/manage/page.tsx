// app/creator/contest/[id]/manage/page.tsx
import { revalidatePath } from "next/cache";
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
  ArrowLeft,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  DollarSign,
  Play,
  Pause,
  Edit,
  Star,
  Download,
  TrendingUp,
  Check,
  X,
  Trophy,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- SERVER ACTION BARU UNTUK APPROVE/REJECT ---
async function approveSubmission(submissionId: number, contestId: number) {
  "use server";
  const supabase = createClient();
  const { error } = await supabase
    .from("submissions")
    .update({ status: "approved" })
    .eq("id", submissionId);

  if (!error) {
    revalidatePath(`/creator/contest/${contestId}/manage`); // Refresh halaman
  } else {
    console.error("Error approving submission:", error.message);
    // Anda bisa menambahkan penanganan error yang lebih baik di sini
  }
}

async function rejectSubmission(submissionId: number, contestId: number) {
  "use server";
  const supabase = createClient();
  const { error } = await supabase
    .from("submissions")
    .update({ status: "rejected" })
    .eq("id", submissionId);

  if (!error) {
    revalidatePath(`/creator/contest/${contestId}/manage`); // Refresh halaman
  } else {
    console.error("Error rejecting submission:", error.message);
    // Anda bisa menambahkan penanganan error yang lebih baik di sini
  }
}

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
  if (!user) redirect("/sign-in");

  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .select(`*, submissions(*, profiles(full_name, username))`)
    .eq("id", contestId)
    .single();

  if (contestError || !contest || contest.creator_id !== user.id) {
    return notFound();
  }

  // Pisahkan submisi berdasarkan statusnya
  const pendingReviewSubmissions = contest.submissions.filter(
    (s) => s.status === "pending_relevance_check",
  );
  const approvedSubmissions = contest.submissions.filter(
    (s) => s.status === "approved",
  );

  // Kalkulasi statistik lainnya
  const totalParticipants = new Set(
    approvedSubmissions.map((s) => s.profiles?.username),
  ).size;

  // 1. Hitung Total Views dari semua submisi
  const totalViews = contest.submissions.reduce(
    (sum, submission) => sum + (submission.view_count || 0),
    0,
  );

  // 2. Format sisa waktu dengan benar
  const timeLeft =
    new Date(contest.end_date) > new Date()
      ? formatDistanceToNowStrict(new Date(contest.end_date), {
          addSuffix: true,
        })
      : "Finished";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center transition-colors hover:text-yellow-400"
              >
                <ArrowLeft className="h-8 w-8" />
              </Link>
              <div>
                <h1 className="text-4xl font-black uppercase text-white">
                  MANAGE CONTEST
                </h1>
                <p className="text-white font-bold">{contest.title}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Contest Progress Card (statis untuk saat ini) */}
        <Card className="mb-8 border-4 border-black bg-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase text-black">
              Contest Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-black">
            <div className="text-center bg-white p-4 border-2 border-black">
              <Users className="h-6 w-6 mx-auto mb-1" />
              <div className="font-black text-xl">{totalParticipants}</div>
              <div className="text-xs font-bold">Participants</div>
            </div>
            <div className="text-center bg-white p-4 border-2 border-black">
              <Eye className="h-6 w-6 mx-auto mb-1" />
              <div className="font-black text-xl">
                {totalViews > 1000
                  ? `${(totalViews / 1000).toFixed(1)}K`
                  : totalViews}
              </div>
              <div className="text-xs font-bold">Total Views</div>
            </div>
            <div className="text-center bg-white p-4 border-2 border-black">
              <Clock className="h-6 w-6 mx-auto mb-1" />
              <div className="font-black text-xl">
                {formatDistanceToNowStrict(new Date(contest.end_date))}
              </div>
              <div className="text-xs font-bold">Time Left</div>
            </div>
            <div className="text-center bg-white p-4 border-2 border-black">
              <DollarSign className="h-6 w-6 mx-auto mb-1" />
              <div className="font-black text-xl">
                ${Number(contest.prize_pool).toLocaleString()}
              </div>
              <div className="text-xs font-bold">Prize Pool</div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="review" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
            <TabsTrigger
              value="review"
              className="font-black uppercase data-[state=active]:text-pink-500 data-[state=active]:bg-transparent"
            >
              For Review ({pendingReviewSubmissions.length})
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="font-black uppercase data-[state=active]:text-pink-500 data-[state=active]:bg-transparent"
            >
              Leaderboard ({approvedSubmissions.length})
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="font-black uppercase data-[state=active]:text-pink-500 data-[state=active]:bg-transparent"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* TAB BARU: For Review */}
          <TabsContent value="review" className="space-y-4">
            <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase">
                  Submissions for Review
                </CardTitle>
                <CardDescription className="font-bold">
                  Approve clips that are relevant to your contest. Approved
                  clips will appear on the leaderboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingReviewSubmissions.length > 0 ? (
                  pendingReviewSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center gap-4 p-4 border-2 border-black rounded-lg hover:bg-gray-50 transition-colors duration-200 "
                    >
                      <div className="flex-1">
                        <a
                          href={submission.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold hover:underline text-blue-600"
                        >
                          {submission.profiles?.full_name || "Clipper"}{" "}
                          submitted a clip
                        </a>
                        <p className="text-sm text-gray-600 font-mono">
                          {submission.video_url}
                        </p>
                        <p className="text-xs text-gray-500 font-bold">
                          @{submission.profiles?.username}
                        </p>
                      </div>
                      <Button
                        onClick={() => approveSubmission(submission.id)}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => rejectSubmission(submission.id)}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center font-bold p-8 bg-gray-50 border-2 border-black rounded-lg">
                    <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No new submissions to review.</p>
                    <p className="text-sm text-gray-600 mt-2">
                      All caught up! 🎉
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB LEADERBOARD (sebelumnya Submissions) */}
          <TabsContent value="leaderboard" className="space-y-4">
            <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Current Leaderboard
                </CardTitle>
                <CardDescription className="font-bold">
                  Approved submissions ranked by engagement and quality.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {approvedSubmissions.length > 0 ? (
                  approvedSubmissions.map((submission, index) => (
                    <div
                      key={submission.id}
                      className="flex items-center gap-4 p-4 border-2 border-black rounded-lg hover:bg-yellow-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-yellow-400 border-2 border-black rounded-full font-black">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">
                          {submission.profiles?.full_name || "Clipper"}
                        </div>
                        <p className="text-sm text-gray-600 font-bold">
                          @{submission.profiles?.username}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-lg">
                          {Math.floor(Math.random() * 1000) + 100} pts
                        </div>
                        <div className="text-xs text-gray-600 font-bold">
                          {Math.floor(Math.random() * 50) + 10} likes
                        </div>
                      </div>
                      <a
                        href={submission.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="bg-pink-500 hover:bg-pink-600 text-white border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Watch
                        </Button>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-center font-bold p-8 bg-gray-50 border-2 border-black rounded-lg">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No approved submissions yet.</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Review submissions to build the leaderboard!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB SETTINGS */}
          <TabsContent value="settings">
            <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Contest Settings
                </CardTitle>
                <CardDescription className="font-bold">
                  Manage your contest configuration and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-black rounded-lg bg-gray-50">
                    <h3 className="font-black uppercase mb-2">
                      Contest Status
                    </h3>
                    <Badge className="bg-green-500 text-white border-2 border-black font-bold">
                      ACTIVE
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
