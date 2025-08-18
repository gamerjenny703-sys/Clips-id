import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  DollarSign,
  Trophy,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Upload,
  TrendingUp,
  Star,
  Filter,
  Youtube,
  Instagram,
  Twitter,
  CheckCircle,
} from "lucide-react";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black uppercase text-white">
                CLIPPER DASHBOARD
              </h1>
              <p className="text-white font-bold">
                FIND CONTESTS, SUBMIT CLIPS, AND EARN REWARDS
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="border-4 border-white bg-yellow-400 text-black font-black uppercase">
                <Star className="mr-1 h-3 w-3 fill-black text-black" />
                LEVEL 3 CLIPPER
              </Badge>
              <Link href="/user/contest-details">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-white">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-white">$1,247</div>
              <p className="text-xs font-bold text-white">+$180 this month</p>
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
              <div className="text-2xl font-black text-black">8</div>
              <p className="text-xs font-bold text-black">67% win rate</p>
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
              <div className="text-2xl font-black text-black">5</div>
              <p className="text-xs font-bold text-black">In 3 contests</p>
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
              <div className="text-2xl font-black text-black">12.4K</div>
              <p className="text-xs font-bold text-black">Across all clips</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Contests */}
          <div className="lg:col-span-2">
            <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-black uppercase text-black">
                      AVAILABLE CONTESTS
                    </CardTitle>
                    <CardDescription className="font-bold text-black">
                      Find and join contests to start earning
                    </CardDescription>
                  </div>
                  <Button className="bg-yellow-400 text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Filter className="mr-2 h-4 w-4" />
                    FILTER
                  </Button>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
                    <Input
                      placeholder="SEARCH CONTESTS..."
                      className="pl-10 border-4 border-black bg-white font-bold uppercase placeholder:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Best Gaming Highlights",
                    creator: "GameMaster Pro",
                    prize: "$500",
                    participants: 45,
                    timeLeft: "3 days",
                    difficulty: "Medium",
                    tags: ["Gaming", "Highlights", "Action"],
                    requirements: "TikTok clips, 15-60 seconds",
                  },
                  {
                    title: "Funny Moments Compilation",
                    creator: "ComedyKing",
                    prize: "$300",
                    participants: 28,
                    timeLeft: "1 week",
                    difficulty: "Easy",
                    tags: ["Comedy", "Viral", "Entertainment"],
                    requirements: "Any platform, 10-30 seconds",
                  },
                  {
                    title: "Tutorial Clips Challenge",
                    creator: "EduContent",
                    prize: "$200",
                    participants: 67,
                    timeLeft: "2 days",
                    difficulty: "Hard",
                    tags: ["Educational", "Tutorial", "How-to"],
                    requirements: "YouTube clips, must include captions",
                  },
                ].map((contest, index) => (
                  <div
                    key={index}
                    className="border-4 border-black rounded-lg p-4 bg-cyan-400 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{contest.title}</h3>
                        <p className="text-sm text-black">
                          by {contest.creator}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {contest.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge
                        variant={
                          contest.difficulty === "Hard"
                            ? "destructive"
                            : contest.difficulty === "Medium"
                              ? "default"
                              : "secondary"
                        }
                        className="font-bold"
                      >
                        {contest.difficulty}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-black mb-3">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {contest.prize}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {contest.participants} joined
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {contest.timeLeft} left
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {contest.requirements}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button className="bg-pink-500 text-white border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        JOIN CONTEST
                      </Button>
                      <Button className="bg-white text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        VIEW DETAILS
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Media Connections */}
            <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-black">
                  SOCIAL ACCOUNTS
                </CardTitle>
                <CardDescription className="font-bold text-black">
                  Connect your accounts to submit clips
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    platform: "YouTube",
                    icon: Youtube,
                    connected: true,
                    username: "@yourhandle",
                  },
                  {
                    platform: "TikTok",
                    icon: Instagram,
                    connected: true,
                    username: "@yourhandle",
                  },
                  {
                    platform: "Twitter",
                    icon: Twitter,
                    connected: false,
                    username: null,
                  },
                ].map((account, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-black rounded-lg bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <account.icon className="h-5 w-5" />
                      <div>
                        <p className="font-medium text-sm">
                          {account.platform}
                        </p>
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-4 border-black text-xs bg-transparent"
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Performance */}
            <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-white">
                  RECENT SUBMISSIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    contest: "Gaming Highlights",
                    status: "winning",
                    position: "#1",
                    engagement: { likes: 124, comments: 23, shares: 12 },
                    timeAgo: "2 hours ago",
                  },
                  {
                    contest: "Funny Moments",
                    status: "competing",
                    position: "#3",
                    engagement: { likes: 67, comments: 8, shares: 4 },
                    timeAgo: "1 day ago",
                  },
                  {
                    contest: "Tutorial Clips",
                    status: "ended",
                    position: "#2",
                    engagement: { likes: 89, comments: 15, shares: 7 },
                    timeAgo: "3 days ago",
                  },
                ].map((submission, index) => (
                  <div
                    key={index}
                    className="p-3 border border-black rounded-lg bg-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">
                        {submission.contest}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            submission.status === "winning"
                              ? "default"
                              : submission.status === "competing"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs font-bold"
                        >
                          {submission.position}
                        </Badge>
                        {submission.status === "winning" && (
                          <Trophy className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-black">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {submission.engagement.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {submission.engagement.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-3 w-3" />
                          {submission.engagement.shares}
                        </span>
                      </div>
                      <span>{submission.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-black">
                  THIS MONTH
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Contests Joined</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Win Rate</span>
                  <span className="font-bold text-black">67%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Engagement</span>
                  <span className="font-bold">89</span>
                </div>
                <div className="pt-2">
                  <Button className="w-full bg-black text-white border-4 border-black hover:bg-cyan-400 hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    VIEW ANALYTICS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
