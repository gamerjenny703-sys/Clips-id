import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Plus, DollarSign, Users, Eye, TrendingUp, Clock, Trophy, Heart, MessageCircle, Share2 } from "lucide-react"
import Link from "next/link"

export default function CreatorDashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black uppercase text-white">CREATOR DASHBOARD</h1>
              <p className="text-white font-bold">MANAGE YOUR CONTENT CLIPPING CONTESTS</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-4 border-black bg-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-black">Active Contests</CardTitle>
              <Trophy className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-black">12</div>
              <p className="text-xs font-bold text-black">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-black">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-black">1,247</div>
              <p className="text-xs font-bold text-black">+180 this week</p>
            </CardContent>
          </Card>

          <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-white">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-white">45.2K</div>
              <p className="text-xs font-bold text-white">+12% from last week</p>
            </CardContent>
          </Card>

          <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase text-black">Prize Pool</CardTitle>
              <DollarSign className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-black">$8,450</div>
              <p className="text-xs font-bold text-black">Across all contests</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Contests */}
          <div className="lg:col-span-2">
            <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase text-black">ACTIVE CONTESTS</CardTitle>
                <CardDescription className="font-bold text-black">
                  Monitor your ongoing content clipping contests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Best Gaming Highlights",
                    prize: "$500",
                    submissions: 45,
                    timeLeft: "3 days",
                    progress: 75,
                    status: "active",
                  },
                  {
                    title: "Funny Moments Compilation",
                    prize: "$300",
                    submissions: 28,
                    timeLeft: "1 week",
                    progress: 40,
                    status: "active",
                  },
                  {
                    title: "Tutorial Clips",
                    prize: "$200",
                    submissions: 67,
                    timeLeft: "2 days",
                    progress: 90,
                    status: "ending-soon",
                  },
                ].map((contest, index) => (
                  <div
                    key={index}
                    className="border-4 border-black rounded-lg p-4 bg-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{contest.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {contest.prize}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {contest.submissions} submissions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {contest.timeLeft} left
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={contest.status === "ending-soon" ? "destructive" : "default"}
                        className="font-bold"
                      >
                        {contest.status === "ending-soon" ? "ENDING SOON" : "ACTIVE"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{contest.progress}%</span>
                      </div>
                      <Progress value={contest.progress} className="h-2" />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                      >
                        VIEW SUBMISSIONS
                      </Button>
                      <Button
                        size="sm"
                        className="bg-yellow-400 text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        EDIT CONTEST
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Top Performers */}
          <div className="space-y-6">
            {/* Recent Submissions */}
            <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-black">RECENT SUBMISSIONS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    user: "Alex Chen",
                    avatar: "/placeholder.svg?height=32&width=32",
                    contest: "Gaming Highlights",
                    time: "2 min ago",
                    engagement: { likes: 12, comments: 3, shares: 1 },
                  },
                  {
                    user: "Sarah Kim",
                    avatar: "/placeholder.svg?height=32&width=32",
                    contest: "Funny Moments",
                    time: "15 min ago",
                    engagement: { likes: 8, comments: 2, shares: 0 },
                  },
                  {
                    user: "Mike Johnson",
                    avatar: "/placeholder.svg?height=32&width=32",
                    contest: "Tutorial Clips",
                    time: "1 hour ago",
                    engagement: { likes: 24, comments: 7, shares: 3 },
                  },
                ].map((submission, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={submission.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {submission.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{submission.user}</p>
                      <p className="text-xs text-muted-foreground">{submission.contest}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
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
                    </div>
                    <span className="text-xs text-muted-foreground">{submission.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-white">QUICK ACTIONS</CardTitle>
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
  )
}
