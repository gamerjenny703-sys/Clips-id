"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Trophy,
  Clock,
  Target,
  Zap,
  RefreshCw,
  Calendar,
  BarChart3,
} from "lucide-react"

interface MetricData {
  current: number
  previous: number
  change: number
  changePercent: number
  trend: "up" | "down" | "stable"
}

interface ContestProgress {
  id: string
  title: string
  rank: number
  totalParticipants: number
  score: number
  maxScore: number
  metrics: {
    views: MetricData
    likes: MetricData
    comments: MetricData
    shares: MetricData
  }
  timeRemaining: string
  lastUpdated: string
  isWinning: boolean
}

interface ProgressTrackerProps {
  userId?: string
  contestId?: string
  showRealTime?: boolean
}

export default function ProgressTracker({ userId, contestId, showRealTime = true }: ProgressTrackerProps) {
  const [isTracking, setIsTracking] = useState(showRealTime)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [contests, setContests] = useState<ContestProgress[]>([
    {
      id: "1",
      title: "Best Gaming Highlights",
      rank: 1,
      totalParticipants: 45,
      score: 95,
      maxScore: 100,
      metrics: {
        views: { current: 12500, previous: 11800, change: 700, changePercent: 5.9, trend: "up" },
        likes: { current: 890, previous: 820, change: 70, changePercent: 8.5, trend: "up" },
        comments: { current: 45, previous: 42, change: 3, changePercent: 7.1, trend: "up" },
        shares: { current: 23, previous: 20, change: 3, changePercent: 15.0, trend: "up" },
      },
      timeRemaining: "2 days, 14 hours",
      lastUpdated: "2 minutes ago",
      isWinning: true,
    },
    {
      id: "2",
      title: "Funny Moments Compilation",
      rank: 3,
      totalParticipants: 28,
      score: 87,
      maxScore: 100,
      metrics: {
        views: { current: 8900, previous: 9200, change: -300, changePercent: -3.3, trend: "down" },
        likes: { current: 567, previous: 580, change: -13, changePercent: -2.2, trend: "down" },
        comments: { current: 32, previous: 35, change: -3, changePercent: -8.6, trend: "down" },
        shares: { current: 18, previous: 16, change: 2, changePercent: 12.5, trend: "up" },
      },
      timeRemaining: "5 days, 8 hours",
      lastUpdated: "5 minutes ago",
      isWinning: false,
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      setContests((prev) =>
        prev.map((contest) => ({
          ...contest,
          metrics: {
            views: {
              ...contest.metrics.views,
              current: contest.metrics.views.current + Math.floor(Math.random() * 50),
            },
            likes: {
              ...contest.metrics.likes,
              current: contest.metrics.likes.current + Math.floor(Math.random() * 5),
            },
            comments: {
              ...contest.metrics.comments,
              current: contest.metrics.comments.current + Math.floor(Math.random() * 2),
            },
            shares: {
              ...contest.metrics.shares,
              current: contest.metrics.shares.current + Math.floor(Math.random() * 2),
            },
          },
          lastUpdated: "Just now",
        })),
      )
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isTracking])

  const MetricCard = ({ icon: Icon, label, data, color }: any) => (
    <Card className="border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${color}`} />
            <span className="text-sm font-medium">{label}</span>
          </div>
          <div className="flex items-center gap-1">
            {data.trend === "up" ? (
              <TrendingUp className="h-3 w-3 text-primary" />
            ) : data.trend === "down" ? (
              <TrendingDown className="h-3 w-3 text-destructive" />
            ) : (
              <div className="h-3 w-3" />
            )}
            <span
              className={`text-xs font-bold ${
                data.trend === "up"
                  ? "text-primary"
                  : data.trend === "down"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {data.changePercent > 0 ? "+" : ""}
              {data.changePercent.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="text-2xl font-bold">{data.current.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">
          {data.change > 0 ? "+" : ""}
          {data.change.toLocaleString()} from last update
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Real-time Status */}
      <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Progress Tracking</CardTitle>
              <CardDescription>Real-time monitoring of your contest performance</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isTracking ? "bg-primary animate-pulse" : "bg-muted"}`} />
                <span className="text-sm text-muted-foreground">
                  {isTracking ? "Live tracking" : "Tracking paused"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTracking(!isTracking)}
                className="border-2 bg-transparent"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isTracking ? "animate-spin" : ""}`} />
                {isTracking ? "Pause" : "Resume"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()} • Next update in: {isTracking ? "30 seconds" : "Paused"}
          </div>
        </CardContent>
      </Card>

      {/* Contest Progress */}
      {contests.map((contest) => (
        <Card key={contest.id} className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">{contest.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    Rank #{contest.rank} of {contest.totalParticipants}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {contest.timeRemaining} left
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Score: {contest.score}/{contest.maxScore}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {contest.isWinning && (
                  <Badge className="bg-accent text-accent-foreground font-bold">
                    <Trophy className="mr-1 h-3 w-3" />
                    WINNING
                  </Badge>
                )}
                <Badge variant="outline" className="font-bold">
                  {contest.lastUpdated}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Contest Score</span>
                <span className="font-bold">
                  {contest.score}/{contest.maxScore}
                </span>
              </div>
              <Progress value={(contest.score / contest.maxScore) * 100} className="h-3" />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard icon={Eye} label="Views" data={contest.metrics.views} color="text-primary" />
              <MetricCard icon={Heart} label="Likes" data={contest.metrics.likes} color="text-destructive" />
              <MetricCard icon={MessageCircle} label="Comments" data={contest.metrics.comments} color="text-accent" />
              <MetricCard icon={Share2} label="Shares" data={contest.metrics.shares} color="text-primary" />
            </div>

            {/* Performance Insights */}
            <Alert className="border-2 border-primary bg-primary/10">
              <Zap className="h-4 w-4" />
              <AlertDescription>
                {contest.isWinning
                  ? "You're currently winning! Your engagement rate is 23% above average."
                  : "You're close to the top! Increase engagement by 15% to move up to 2nd place."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ))}

      {/* Analytics Tabs */}
      <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-muted border-2 border-border">
              <TabsTrigger value="overview" className="font-bold">
                Overview
              </TabsTrigger>
              <TabsTrigger value="trends" className="font-bold">
                Trends
              </TabsTrigger>
              <TabsTrigger value="comparison" className="font-bold">
                Comparison
              </TabsTrigger>
              <TabsTrigger value="insights" className="font-bold">
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2 border-border">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-muted-foreground">Active Contests</div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-border">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">91</div>
                    <div className="text-sm text-muted-foreground">Average Score</div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-border">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">67%</div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <Alert className="border-2 border-accent bg-accent/10">
                <BarChart3 className="h-4 w-4" />
                <AlertDescription>
                  Your performance has improved by 15% over the last week. Views are trending upward, especially during
                  evening hours.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="comparison">
              <Alert className="border-2 border-primary bg-primary/10">
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  You're performing 23% better than the average participant. Your engagement rate is particularly strong
                  on gaming content.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="insights">
              <div className="space-y-4">
                <Alert className="border-2 border-accent bg-accent/10">
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Best posting time:</strong> Your clips perform 40% better when posted between 7-9 PM EST.
                  </AlertDescription>
                </Alert>
                <Alert className="border-2 border-primary bg-primary/10">
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Content tip:</strong> Gaming highlights with commentary get 2x more engagement than silent
                    clips.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
