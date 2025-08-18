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
  Youtube,
  Eye,
  Heart,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Target,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";

// Menambahkan ini untuk memastikan halaman selalu dirender secara dinamis
export const dynamic = "force-dynamic";

// Helper function untuk menghitung sisa waktu
const getTimeLeft = (endDate: string | null) => {
  if (!endDate) return "N/A";
  try {
    return formatDistanceToNow(new Date(endDate), { addSuffix: true });
  } catch (error) {
    return "Invalid date";
  }
};

export default async function ContestDetails({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // 1. Mengambil data kontes tunggal berdasarkan ID dari URL
  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .select(
      `
       *,
       profiles (
         full_name,
         username
       )
     `,
    )
    .eq("id", params.id)
    .single();

  // 2. Mengambil 3 submisi teratas untuk leaderboard
  const { data: submissions, error: submissionsError } = await supabase
    .from("submissions")
    .select(
      `
         *,
         profiles (
             username,
             full_name
         )
     `,
    )
    .eq("contest_id", params.id)
    .order("view_count", { ascending: false }) // Diurutkan berdasarkan views
    .limit(3);

  // 3. Jika kontes tidak ditemukan, tampilkan halaman 404
  if (contestError || !contest) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button className="bg-white text-black border-4 border-white hover:bg-pink-500 hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK
              </Button>
              <div>
                <h1 className="text-4xl font-black uppercase text-white">
                  CONTEST DETAILS
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
                      BEST GAMING HIGHLIGHTS
                    </CardTitle>
                    <CardDescription className="font-bold text-white text-lg">
                      by GameMaster Pro
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-3">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-white text-black font-bold">
                          GM
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-white fill-white" />
                        <span className="text-white font-bold">
                          4.9 (127 reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <Youtube className="h-8 w-8 text-white" />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {["Gaming", "Highlights", "Action", "Competitive"].map(
                    (tag, index) => (
                      <Badge
                        key={index}
                        className="bg-white text-black border-2 border-black font-bold"
                      >
                        {tag}
                      </Badge>
                    ),
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-white font-bold text-lg">
                  Show off your best gaming moments! We're looking for epic
                  highlights, clutch plays, and jaw-dropping moments that will
                  make viewers go "WOW!" The most engaging clip wins the prize.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white border-4 border-black rounded-lg">
                  <div className="text-center">
                    <DollarSign className="h-6 w-6 mx-auto text-black mb-1" />
                    <div className="font-black text-xl text-black">$500</div>
                    <div className="text-xs font-bold text-black">
                      PRIZE POOL
                    </div>
                  </div>
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto text-black mb-1" />
                    <div className="font-black text-xl text-black">3 DAYS</div>
                    <div className="text-xs font-bold text-black">
                      TIME LEFT
                    </div>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-black mb-1" />
                    <div className="font-black text-xl text-black">45</div>
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

            {/* Requirements */}
            <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase text-black">
                  REQUIREMENTS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-black mt-0.5" />
                      <div>
                        <p className="font-black text-black">
                          Duration: 15-60 seconds
                        </p>
                        <p className="text-sm font-bold text-black">
                          Keep it short and engaging
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-black mt-0.5" />
                      <div>
                        <p className="font-black text-black">
                          Gaming content only
                        </p>
                        <p className="text-sm font-bold text-black">
                          Any game, any platform
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-black mt-0.5" />
                      <div>
                        <p className="font-black text-black">
                          Original content
                        </p>
                        <p className="text-sm font-bold text-black">
                          Must be your own gameplay
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-black mt-0.5" />
                      <div>
                        <p className="font-black text-black">Must be public</p>
                        <p className="text-sm font-bold text-black">
                          Visible to all viewers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-black mt-0.5" />
                      <div>
                        <p className="font-black text-black">
                          High quality video
                        </p>
                        <p className="text-sm font-bold text-black">
                          720p minimum resolution
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-black mt-0.5" />
                      <div>
                        <p className="font-black text-black">
                          Include hashtags
                        </p>
                        <p className="text-sm font-bold text-black">
                          #GamingHighlights #Contest
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Leaderboard */}
            <Card className="border-4 border-black bg-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase text-black">
                  CURRENT LEADERBOARD
                </CardTitle>
                <CardDescription className="font-bold text-black">
                  Top submissions so far
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    rank: 1,
                    user: "ProGamer123",
                    title: "Insane 1v5 Clutch",
                    engagement: { views: 12400, likes: 890, comments: 156 },
                    score: 95,
                  },
                  {
                    rank: 2,
                    user: "GameMaster",
                    title: "Perfect Headshot Montage",
                    engagement: { views: 8900, likes: 567, comments: 89 },
                    score: 87,
                  },
                  {
                    rank: 3,
                    user: "ClipKing",
                    title: "Epic Boss Fight Finish",
                    engagement: { views: 6700, likes: 445, comments: 67 },
                    score: 82,
                  },
                ].map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white border-4 border-black rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-black text-white font-black rounded">
                      {entry.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-black">{entry.title}</p>
                      <p className="text-sm font-bold text-black">
                        by {entry.user}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {entry.engagement.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {entry.engagement.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {entry.engagement.comments}
                      </span>
                    </div>
                    <Badge className="bg-pink-500 text-white font-black">
                      {entry.score}%
                    </Badge>
                  </div>
                ))}
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
                    <p className="text-sm font-bold text-black">Dec 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-black" />
                  <div>
                    <p className="font-black text-black">Ends</p>
                    <p className="text-sm font-bold text-black">
                      Dec 18, 2024 (3 days left)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-black" />
                  <div>
                    <p className="font-black text-black">Winner Announced</p>
                    <p className="text-sm font-bold text-black">Dec 19, 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Judging Criteria */}
            <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-white">
                  JUDGING CRITERIA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Engagement (40%)
                  </span>
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Creativity (30%)
                  </span>
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Quality (20%)
                  </span>
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Relevance (10%)
                  </span>
                  <Target className="h-4 w-4 text-white" />
                </div>
              </CardContent>
            </Card>

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
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback className="bg-white text-black font-bold">
                      GM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-black text-black">GameMaster Pro</p>
                    <p className="text-sm font-bold text-black">
                      Gaming Content Creator
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Contests Created</span>
                    <span className="font-black">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Total Prize Pool</span>
                    <span className="font-black">$12,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-black" />
                      <span className="font-black">4.9</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-pink-500 text-white border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-16 text-lg">
                JOIN CONTEST
              </Button>
              <Button className="w-full bg-white text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                SHARE CONTEST
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
