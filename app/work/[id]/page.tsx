// app/work/[id]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
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
import {
  DollarSign,
  Trophy,
  Clock,
  Users,
  ArrowLeft,
  Star,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Target,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format, addDays } from "date-fns";
import SaveContestButton from "@/components/features/contest/SaveContestButton"; // Impor komponen baru

export const dynamic = "force-dynamic";

// Helper untuk waktu
const getTimeLeft = (endDate: string | null) => {
  if (!endDate) return "Until Won";
  return formatDistanceToNow(new Date(endDate), { addSuffix: true });
};

// Helper untuk inisial
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export default async function ContestDetails({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const contestId = Number(params.id);

  // Mengambil data kontes tunggal
  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .select(`*, profiles (full_name, username)`)
    .eq("id", contestId)
    .single();

  if (contestError || !contest) {
    notFound();
  }

  // Mengambil 3 submisi teratas
  const { data: submissions, error: submissionsError } = await supabase
    .from("submissions")
    .select(`*, profiles (username, full_name)`)
    .eq("contest_id", contestId)
    .order("view_count", { ascending: false })
    .limit(3);

  // Mengambil jumlah total partisipan
  const { count: participantCount, error: countError } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("contest_id", contestId);

  // Mengambil statistik kreator
  let creatorStats = { contestsCreated: 0, totalPrizePool: 0 };
  if (contest.creator_id) {
    const { data: creatorContests, error: creatorError } = await supabase
      .from("contests")
      .select("prize_pool")
      .eq("creator_id", contest.creator_id);

    if (creatorContests) {
      creatorStats.contestsCreated = creatorContests.length;
      creatorStats.totalPrizePool = creatorContests.reduce(
        (sum, current) => sum + (current.prize_pool || 0),
        0,
      );
    }
  }

  // Helper variables
  const creatorName =
    contest.profiles?.full_name ||
    contest.profiles?.username ||
    "Anonymous Creator";
  const winnerAnnouncedDate = contest.end_date
    ? format(addDays(new Date(contest.end_date), 1), "MMM d, yyyy")
    : "After winner found";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/work">
                <Button className="bg-white text-black border-4 border-white hover:bg-pink-500 hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  BACK
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-black uppercase text-white">
                  {contest.title}
                </h1>
                <p className="text-white font-bold">
                  EVERYTHING YOU NEED TO KNOW
                </p>
              </div>
            </div>
            <Button className="bg-pink-500 text-white border-4 border-white hover:bg-white hover:text-black font-black uppercase shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              JOIN CONTEST
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contest Overview */}
            <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-black uppercase text-white">
                      {contest.title}
                    </CardTitle>
                    <CardDescription className="font-bold text-white text-lg">
                      by {creatorName}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-3">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-white text-black font-bold">
                          {getInitials(creatorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-white fill-white" />
                        <span className="text-white font-bold">
                          {creatorStats.contestsCreated} Contests Created
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {contest.requirements?.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {contest.requirements.tags.map(
                      (tag: string, index: number) => (
                        <Badge
                          key={index}
                          className="bg-white text-black border-2 border-black font-bold"
                        >
                          {tag}
                        </Badge>
                      ),
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-white font-bold text-lg">
                  {contest.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white border-4 border-black rounded-lg">
                  <div className="text-center">
                    <DollarSign className="h-6 w-6 mx-auto text-black mb-1" />
                    <div className="font-black text-xl text-black">
                      ${contest.prize_pool}
                    </div>
                    <div className="text-xs font-bold text-black">
                      PRIZE POOL
                    </div>
                  </div>
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto text-black mb-1" />
                    <div className="font-black text-xl text-black uppercase">
                      {getTimeLeft(contest.end_date)}
                    </div>
                    <div className="text-xs font-bold text-black">
                      TIME LEFT
                    </div>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-black mb-1" />
                    <div className="font-black text-xl text-black">
                      {participantCount ?? 0}
                    </div>
                    <div className="text-xs font-bold text-black">
                      PARTICIPANTS
                    </div>
                  </div>
                  <div className="text-center">
                    <Trophy className="h-6 w-6 mx-auto text-black mb-1" />
                    <div className="font-black text-xl text-black">MEDIUM</div>
                    <div className="text-xs font-bold text-black">
                      DIFFICULTY
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements Card (tetap statis sesuai permintaan) */}

            {/* Leaderboard Card */}
            <Card className="border-4 border-black bg-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase text-black">
                  CURRENT LEADERBOARD
                </CardTitle>
                <CardDescription className="font-bold text-black">
                  Top submissions so far (by views)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {submissions && submissions.length > 0 ? (
                  submissions.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-4 p-4 bg-white border-4 border-black rounded-lg"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-black text-white font-black rounded">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-black truncate">
                          Clip by {entry.profiles?.username || "user"}
                        </p>
                        <p className="text-sm font-bold text-black truncate">
                          <a
                            href={entry.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {entry.video_url}
                          </a>
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {entry.view_count?.toLocaleString() ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {entry.like_count?.toLocaleString() ?? 0}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="font-bold text-center">
                    No submissions yet. Be the first!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contest Timeline */}
            <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-black">
                  CONTEST TIMELINE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-black" />
                  <div>
                    <p className="font-black text-black">Started</p>
                    <p className="text-sm font-bold text-black">
                      {format(new Date(contest.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-black" />
                  <div>
                    <p className="font-black text-black">Ends</p>
                    <p className="text-sm font-bold text-black">
                      {contest.end_date
                        ? format(new Date(contest.end_date), "MMM d, yyyy")
                        : "Until Winner"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-black" />
                  <div>
                    <p className="font-black text-black">Winner Announced</p>
                    <p className="text-sm font-bold text-black">
                      {winnerAnnouncedDate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Judging Criteria (tetap statis) */}

            {/* Creator Profile */}
            <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-black">
                  CREATOR PROFILE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-black">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-white text-black font-bold">
                      {getInitials(creatorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-black text-black">{creatorName}</p>
                    <p className="text-sm font-bold text-black">
                      Content Creator
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Contests Created</span>
                    <span className="font-black">
                      {creatorStats.contestsCreated}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Total Prize Pool</span>
                    <span className="font-black">
                      ${creatorStats.totalPrizePool.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-pink-500 text-white border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-16 text-lg">
                JOIN CONTEST
              </Button>
              <SaveContestButton contestId={contest.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
