// app/user/submit-clip/[id]/page.tsx

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Clock, DollarSign, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import SubmitClipForm from "@/components/features/contest/SubmitClipForm";

export const dynamic = "force-dynamic";

const getTimeLeft = (endDate: string | null) => {
  if (!endDate) return "Until Won";
  const now = new Date();
  const end = new Date(endDate);
  if (now > end) return "Finished";
  return formatDistanceToNow(end, { addSuffix: true });
};

export default async function SubmitClipPage({
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
    redirect("/sign-in");
  }

  const { data: contest } = await supabase
    .from("contests")
    .select("id, title, prize_pool, end_date, requirements")
    .eq("id", contestId)
    .single();

  if (!contest) {
    notFound();
  }

  const { data: connectedPlatforms } = await supabase
    .from("social_connections")
    .select("platform, username")
    .eq("user_id", user.id);

  const allowedPlatforms = contest.requirements?.platforms || [];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href={`/work/${contest.id}`}>
              <Button className="bg-white text-black border-4 border-white hover:bg-pink-500 hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK TO CONTEST
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-black uppercase text-white">
                SUBMIT CLIP
              </h1>
              <p className="text-white font-bold">FOR: {contest.title}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase text-black">
                  CLIP SUBMISSION
                </CardTitle>
                <CardDescription className="font-bold text-black">
                  Add one or more clip links for "{contest.title}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubmitClipForm
                  contestId={contest.id}
                  clipperId={user.id}
                  allowedPlatforms={allowedPlatforms}
                  connectedPlatforms={connectedPlatforms || []}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-black">
                  CONTEST INFO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Prize Pool</span>
                  <span className="font-black text-black flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {Number(contest.prize_pool).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Time Left</span>
                  <span className="font-black text-black flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {getTimeLeft(contest.end_date)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
