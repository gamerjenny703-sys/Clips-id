"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
} from "lucide-react"
import Link from "next/link"

export default function ManageContestPage({ params }: { params: { id: string } }) {
  const [contestStatus, setContestStatus] = useState<"active" | "paused" | "ended">("active")

  // Mock contest data
  const contest = {
    id: params.id,
    title: "Best Gaming Highlights Contest",
    description: "Create the most engaging gaming highlight clips from popular streamers",
    prize: 500,
    participants: 45,
    submissions: 67,
    timeLeft: "2 days, 14 hours",
    progress: 75,
    status: contestStatus,
    platforms: ["YouTube", "TikTok"],
    tags: ["Gaming", "Highlights", "Action"],
    createdAt: "2024-01-15",
    endDate: "2024-01-22",
  }

  const submissions = [
    {
      id: "1",
      user: {
        name: "Alex Chen",
        username: "@alexgamer",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      title: "Epic Clutch Moment",
      platform: "YouTube",
      metrics: {
        views: 12500,
        likes: 890,
        comments: 45,
        shares: 23,
      },
      score: 95,
      rank: 1,
      submittedAt: "2 hours ago",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "2",
      user: {
        name: "Sarah Kim",
        username: "@sarahplays",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: false,
      },
      title: "Insane Headshot Compilation",
      platform: "TikTok",
      metrics: {
        views: 8900,
        likes: 567,
        comments: 32,
        shares: 18,
      },
      score: 87,
      rank: 2,
      submittedAt: "5 hours ago",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "3",
      user: {
        name: "Mike Johnson",
        username: "@mikegaming",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      title: "Perfect Team Coordination",
      platform: "YouTube",
      metrics: {
        views: 15200,
        likes: 1200,
        comments: 78,
        shares: 34,
      },
      score: 92,
      rank: 3,
      submittedAt: "1 day ago",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  const analytics = {
    totalViews: 156000,
    totalEngagement: 4500,
    avgScore: 88,
    topPlatform: "YouTube",
    peakHour: "8 PM EST",
  }

  return (
    <div className="min-h-screen bg-white">
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
                <h1 className="text-3xl font-black text-white uppercase">{contest.title}</h1>
                <div className="flex items-center gap-4 text-sm text-pink-100 mt-1 font-bold">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />${contest.prize}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {contest.participants} participants
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {contest.timeLeft} left
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  contest.status === "active" ? "default" : contest.status === "paused" ? "secondary" : "outline"
                }
                className="font-black uppercase border-2 border-black bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                {contest.status.toUpperCase()}
              </Badge>
              <Button
                variant="outline"
                className="border-4 border-black bg-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-400"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Contest
              </Button>
              <Button
                variant={contest.status === "active" ? "secondary" : "default"}
                onClick={() => setContestStatus(contest.status === "active" ? "paused" : "active")}
                className="font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black bg-yellow-400 text-black hover:bg-yellow-300"
              >
                {contest.status === "active" ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause Contest
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume Contest
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Contest Progress */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black uppercase">Contest Progress</h3>
              <span className="text-sm font-bold">{contest.progress}% complete</span>
            </div>
            <Progress value={contest.progress} className="h-4 mb-4 border-2 border-black" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-pink-500 text-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black">{contest.submissions}</div>
                <div className="text-sm font-bold uppercase">Total Submissions</div>
              </div>
              <div className="bg-yellow-400 text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black">{analytics.totalViews.toLocaleString()}</div>
                <div className="text-sm font-bold uppercase">Total Views</div>
              </div>
              <div className="bg-cyan-400 text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black">{analytics.totalEngagement.toLocaleString()}</div>
                <div className="text-sm font-bold uppercase">Total Engagement</div>
              </div>
              <div className="bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black">{analytics.avgScore}</div>
                <div className="text-sm font-bold uppercase">Avg Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <TabsTrigger
              value="submissions"
              className="font-black uppercase data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              Submissions ({contest.submissions})
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

          <TabsContent value="submissions" className="space-y-4">
            {submissions.map((submission) => (
              <Card
                key={submission.id}
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={submission.thumbnail || "/placeholder.svg"}
                      alt={submission.title}
                      className="w-32 h-20 object-cover rounded-lg border-2 border-border"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{submission.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={submission.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {submission.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{submission.user.name}</span>
                            <span className="text-sm text-muted-foreground">{submission.user.username}</span>
                            {submission.user.verified && <Star className="h-3 w-3 fill-accent text-accent" />}
                            <Badge variant="outline" className="text-xs">
                              {submission.platform}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="font-bold">
                            #{submission.rank}
                          </Badge>
                          <div className="text-right">
                            <div className="text-lg font-bold">Score: {submission.score}</div>
                            <div className="text-xs text-muted-foreground">{submission.submittedAt}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {submission.metrics.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {submission.metrics.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {submission.metrics.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-3 w-3" />
                          {submission.metrics.shares}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-4 border-black bg-white font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-400"
                        >
                          View Full Clip
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-4 border-black bg-white font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400"
                        >
                          <Flag className="mr-1 h-3 w-3" />
                          Review
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-4 border-black bg-white font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-500 hover:text-white"
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase">Current Leaderboard</CardTitle>
                <CardDescription className="text-black">
                  Top performing submissions ranked by engagement and quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions
                    .sort((a, b) => b.score - a.score)
                    .map((submission, index) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 border border-black rounded-lg bg-card"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0
                                ? "bg-accent text-accent-foreground"
                                : index === 1
                                  ? "bg-muted text-muted-foreground"
                                  : index === 2
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-background text-foreground border border-border"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={submission.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {submission.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold">{submission.user.name}</div>
                            <div className="text-sm text-muted-foreground">{submission.title}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">Score: {submission.score}</div>
                          <div className="text-sm text-muted-foreground">
                            {submission.metrics.views.toLocaleString()} views
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-black uppercase">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Views</span>
                    <span className="font-bold">{analytics.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Engagement</span>
                    <span className="font-bold">{analytics.totalEngagement.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Score</span>
                    <span className="font-bold">{analytics.avgScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Platform</span>
                    <span className="font-bold">{analytics.topPlatform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak Activity</span>
                    <span className="font-bold">{analytics.peakHour}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-black uppercase">Contest Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="border-2 border-primary bg-primary/10">
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      Your contest is performing 23% better than average! The gaming highlights theme is resonating well
                      with participants.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase">Contest Settings</CardTitle>
                <CardDescription className="text-black">Manage your contest configuration and rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-2 border-accent bg-accent/10">
                  <AlertDescription>
                    Some settings cannot be changed while the contest is active. Pause the contest to make changes.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="border-4 border-black bg-white hover:bg-yellow-400 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    disabled={contest.status === "active"}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Contest Details
                  </Button>
                  <Button
                    variant="outline"
                    className="border-4 border-black bg-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-400"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Submissions
                  </Button>
                  <Button
                    variant="outline"
                    className="border-4 border-black bg-white text-destructive hover:bg-destructive hover:text-destructive-foreground font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    End Contest Early
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
