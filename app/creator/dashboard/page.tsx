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
  ArrowLeft,
  Star,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PaymentRetryButton from "@/components/PaymentRetryButton";
import Script from "next/script";

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
      "id, title, prize_pool, status, end_date, submissions(id, view_count), payment_status, created_at",
    )
    .eq("creator_id", user.id);

  if (contestsError) {
    console.error("Error fetching contests:", contestsError);
  }

  const activeContests = contests?.filter((c) => c.status === "active") || [];
  const pendingPaymentContests =
    contests?.filter(
      (c) => c.status === "pending_payment" || c.payment_status === "pending",
    ) || [];
  const failedPaymentContests =
    contests?.filter(
      (c) => c.status === "payment_failed" || c.payment_status === "failed",
    ) || [];
  const totalSubmissions =
    contests?.reduce((sum, c) => sum + c.submissions.length, 0) || 0;
  const totalViews =
    contests?.reduce(
      (sum, c) =>
        sum +
        c.submissions.reduce(
          (subSum: number, s: any) => subSum + (s.view_count || 0),
          0,
        ),
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
      profiles!inner(full_name),
      contests!inner(title)
    `,
    )
    .in("contest_id", contests?.map((c) => c.id) || [])
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <>
      {/* Load Midtrans Snap Script */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="beforeInteractive"
      />

      <div className="min-h-screen bg-white">
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
                    CREATOR DASHBOARD
                  </h1>
                  <p className="text-white font-bold">
                    MANAGE YOUR CONTENT CLIPPING CONTESTS
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <Badge className="border-4 border-white bg-yellow-400 text-black font-black uppercase">
                  <Star className="mr-1 h-3 w-3 fill-black text-black" />
                  CREATOR
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-4 border-black bg-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                <p className="text-xs font-bold text-black"></p>
              </CardContent>
            </Card>

            <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                <p className="text-xs font-bold text-black"></p>
              </CardContent>
            </Card>

            <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                <p className="text-xs font-bold text-white"></p>
              </CardContent>
            </Card>

            <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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

          {/* Payment Issues Section */}
          {(pendingPaymentContests.length > 0 ||
            failedPaymentContests.length > 0) && (
            <div className="mb-8">
              <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="bg-red-500">
                  <CardTitle className="text-xl font-black uppercase text-white">
                    PAYMENT ISSUES
                  </CardTitle>
                  <CardDescription className="font-bold text-red-100">
                    Complete payment to activate your contests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {pendingPaymentContests.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg text-yellow-600">
                        🔄 Payment Pending
                      </h3>
                      {pendingPaymentContests.map((contest) => (
                        <div
                          key={contest.id}
                          className="border-4 border-yellow-400 rounded-lg p-4 bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-lg text-black">
                                {contest.title}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />$
                                  {Number(contest.prize_pool).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Created{" "}
                                  {new Date(
                                    contest.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Badge className="bg-yellow-400 text-black font-bold border-2 border-black">
                              PAYMENT PENDING
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Your contest is saved but waiting for payment
                            completion. Complete the payment to activate your
                            contest.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-yellow-400 text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                              RETRY PAYMENT
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-4 border-black bg-white text-black hover:bg-gray-100 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                              VIEW DETAILS
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      const progress = Math.min(75 + Math.random() * 20, 95);

                      return (
                        <div
                          key={contest.id}
                          className="border-4 border-black rounded-lg p-4 bg-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-lg text-black">
                              {contest.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-black/80 mt-1">
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
                            <Badge
                              variant={
                                timeLeftDays < 3 ? "destructive" : "default"
                              }
                              className="font-bold border-2 border-black"
                            >
                              {timeLeftDays < 3 ? "ENDING SOON" : "ACTIVE"}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold text-black">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress
                              value={progress}
                              className="h-3 border-2 border-black"
                            />
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Link
                              href={`/creator/contest/${contest.id}/manage`}
                            >
                              <Button
                                size="sm"
                                className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                              >
                                VIEW SUBMISSIONS
                              </Button>
                            </Link>
                            <Link href={`/creator/contest/edit/${contest.id}`}>
                              <Button
                                size="sm"
                                className="bg-yellow-400 text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                              >
                                EDIT CONTEST
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center font-bold p-8 text-gray-600">
                      You have no active contests.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="space-y-6">
              {/* Recent Submissions */}
              <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
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
                        className="flex items-start gap-3 p-3 border-2 border-black rounded-lg bg-white/80 transition-transform hover:translate-x-1 hover:translate-y-1"
                      >
                        <Avatar className="h-8 w-8 border-2 border-black">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-pink-500 text-white font-bold">
                            {submission.profiles?.[0]?.full_name?.substring(
                              0,
                              2,
                            ) || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-black">
                            {submission.profiles?.[0]?.full_name || "Anonymous"}
                          </p>
                          <p className="text-xs text-black/70 font-medium">
                            {submission.contests?.[0]?.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-black/60">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {Math.floor(Math.random() * 50) + 10}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {Math.floor(Math.random() * 20) + 5}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="h-3 w-3" />
                              {Math.floor(Math.random() * 15) + 2}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-black/60 font-medium">
                          {new Date(submission.created_at).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center font-bold p-4 text-black">
                      No recent submissions to your contests.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase text-white">
                    QUICK ACTIONS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/creator/contest/new">
                    <Button className="w-full justify-start bg-black text-white border-4 border-white hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all">
                      <Plus className="mr-2 h-4 w-4" />
                      CREATE NEW CONTEST
                    </Button>
                  </Link>
                  <Button className="w-full justify-start bg-white text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    VIEW ANALYTICS
                  </Button>
                  <Button className="w-full justify-start bg-cyan-400 text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <DollarSign className="mr-2 h-4 w-4" />
                    MANAGE PAYMENTS
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
