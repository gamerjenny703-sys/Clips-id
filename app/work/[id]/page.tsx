import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Layout from "@/components/shared/Layout"; // Kita akan gunakan Layout utama
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

// Helper untuk menghitung sisa waktu
const getTimeLeft = (endDate: string) => {
  return formatDistanceToNow(new Date(endDate), { addSuffix: true });
};

// Ini adalah Server Component, jadi kita bisa buat jadi async
export default async function ContestDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // Ambil data kontes tunggal berdasarkan ID dari URL
  const { data: contest, error } = await supabase
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
    .single(); // .single() untuk mengambil satu baris saja

  // Ambil data submisi teratas untuk leaderboard
  const { data: submissions } = await supabase
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
    .order("view_count", { ascending: false }) // Urutkan berdasarkan views
    .limit(3); // Ambil 3 teratas

  // Jika kontes tidak ditemukan, tampilkan halaman 404
  if (error || !contest) {
    notFound();
  }

  return (
    <Layout>
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
                <CardTitle className="text-3xl font-black uppercase text-white">
                  {contest.title}
                </CardTitle>
                <CardDescription className="font-bold text-white text-lg">
                  by {contest.profiles?.full_name || "A Creator"}
                </CardDescription>
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
                  {/* Data partisipan dan difficulty bisa ditambahkan nanti */}
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
                {submissions?.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 p-4 bg-white border-4 border-black rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-black text-white font-black rounded">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-black">
                        Clip by {entry.profiles?.username}
                      </p>
                      <p className="text-sm font-bold text-black">
                        {entry.video_url}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {entry.view_count.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {entry.like_count}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          {/* ... Sidebar ... (Bisa diisi nanti) */}
        </div>
      </div>
    </Layout>
  );
}
