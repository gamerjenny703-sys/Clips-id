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
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- SERVER ACTION BARU UNTUK APPROVE/REJECT ---
async function approveSubmission(submissionId: number) {
  "use server";
  const supabase = createClient();
  await supabase
    .from("submissions")
    .update({ status: "approved" })
    .eq("id", submissionId);
  revalidatePath(`/creator/contest/${submissionId}/manage`); // Refresh halaman
}

async function rejectSubmission(submissionId: number) {
  "use server";
  const supabase = createClient();
  await supabase
    .from("submissions")
    .update({ status: "rejected" })
    .eq("id", submissionId);
  revalidatePath(`/creator/contest/${submissionId}/manage`); // Refresh halaman
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

  // ... (Kalkulasi statistik lainnya tetap sama) ...
  const totalParticipants = new Set(
    approvedSubmissions.map((s) => s.profiles?.username),
  ).size;

  return (
    <div className="min-h-screen bg-white">
      {/* ... Header (tidak berubah) ... */}

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* ... Card Progress (tidak berubah) ... */}

        <Tabs defaultValue="review" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <TabsTrigger
              value="review"
              className="font-black uppercase data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              For Review ({pendingReviewSubmissions.length})
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="font-black uppercase data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              Leaderboard ({approvedSubmissions.length})
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="font-black uppercase data-[state=active]:bg-pink-500 data-[state=active]:text-white"
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
                      className="flex items-center gap-4 p-4 border-2 border-black rounded-lg"
                    >
                      <div className="flex-1">
                        <a
                          href={submission.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold hover:underline"
                        >
                          {submission.profiles?.full_name || "Clipper"}{" "}
                          submitted a clip
                        </a>
                        <p className="text-sm text-gray-600">
                          {submission.video_url}
                        </p>
                      </div>
                      <form action={() => approveSubmission(submission.id)}>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 border-2 border-black font-bold uppercase"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </form>
                      <form action={() => rejectSubmission(submission.id)}>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="border-2 border-black font-bold uppercase"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </form>
                    </div>
                  ))
                ) : (
                  <p className="text-center font-bold p-4">
                    No new submissions to review.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB LEADERBOARD (sebelumnya Submissions) */}
          <TabsContent value="leaderboard" className="space-y-4">
            {/* Logika untuk menampilkan leaderboard dari 'approvedSubmissions' */}
          </TabsContent>

          {/* TAB SETTINGS */}
          <TabsContent value="settings">
            {/* ... Konten statis settings ... */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
