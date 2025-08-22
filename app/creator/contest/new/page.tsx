"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  DollarSign,
  Info,
  Plus,
  X,
  Youtube,
  Instagram,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    snap: any;
  }
}

export default function CreateContestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");

  const [paymentToken, setPaymentToken] = useState<string | null>(null);

  const [contestData, setContestData] = useState({
    title: "",
    description: "",
    prize_pool: "",
    rules: {
      win_condition: {
        metric: "view_count",
        target: 10000,
      },
      payout: {
        type: "winner_takes_all",
        split_ratio: [0.6, 0.25, 0.15],
      },
      duration: {
        type: "fixed",
        days: 7,
        max_days: 90,
      },
    },
    platforms: [] as string[],
    requirements: "",
    tags: [] as string[],
  });
  useEffect(() => {
    const snapScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    const script = document.createElement("script");
    script.src = snapScriptUrl;
    script.setAttribute("data-client-key", clientKey!);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const platformsOptions = [
    { id: "youtube", name: "YouTube", icon: Youtube },
    { id: "tiktok", name: "TikTok", icon: Instagram },
    { id: "twitter", name: "Twitter", icon: Twitter },
    { id: "instagram", name: "Instagram", icon: Instagram },
  ];

  const addTag = () => {
    if (newTag.trim() && !contestData.tags.includes(newTag.trim())) {
      setContestData({
        ...contestData,
        tags: [...contestData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setContestData({
      ...contestData,
      tags: contestData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const togglePlatform = (platformId: string) => {
    const platforms = contestData.platforms.includes(platformId)
      ? contestData.platforms.filter((p) => p !== platformId)
      : [...contestData.platforms, platformId];
    setContestData({ ...contestData, platforms });
  };

  const handleRulesChange = (path: string, value: any) => {
    setContestData((prev) => {
      const keys = path.split(".");
      let current = prev.rules as any;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return { ...prev };
    });
  };

  // Ganti seluruh fungsi handleSubmit Anda dengan ini

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to create a contest.");
      setIsSubmitting(false);
      return;
    }

    // Validasi dasar
    if (
      !contestData.title ||
      !contestData.description ||
      !contestData.prize_pool
    ) {
      setError("Please fill all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Langkah 1: Minta payment token dari backend kita
      console.log("Requesting payment token...");
      const response = await fetch("/api/payments/midtrans/create-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(contestData.prize_pool),
          contestTitle: contestData.title,
          user: {
            first_name: user.user_metadata?.full_name || "User",
            email: user.email,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || "Failed to get payment token from server.",
        );
      }

      const token = data.token;
      if (!token) {
        throw new Error("Received an empty token from server.");
      }

      console.log("Payment token received. Opening Midtrans Snap...");

      // Langkah 2: Tampilkan popup pembayaran Midtrans Snap
      window.snap.pay(token, {
        onSuccess: async (result: any) => {
          console.log("Payment successful!", result);

          // Langkah 3: HANYA SETELAH PEMBAYARAN SUKSES, simpan kontes ke Supabase
          const endDate = new Date();
          const durationDays =
            contestData.rules.duration.type === "fixed"
              ? contestData.rules.duration.days
              : contestData.rules.duration.max_days;
          endDate.setDate(endDate.getDate() + durationDays);

          const { error: insertError } = await supabase
            .from("contests")
            .insert({
              title: contestData.title,
              description: contestData.description,
              prize_pool: parseFloat(contestData.prize_pool),
              creator_id: user.id,
              end_date: endDate.toISOString(),
              rules: contestData.rules,
              requirements: {
                platforms: contestData.platforms,
                tags: contestData.tags,
                custom: contestData.requirements,
              },
            })
            .select()
            .single(); // .select().single() untuk mendapatkan data yang baru dibuat

          if (insertError) {
            throw new Error(insertError.message);
          }

          console.log("Contest successfully saved to database.");

          // (Opsional) Langkah 4: Panggil API escrow kita
          // await fetch('/api/payments/escrow', { ... });

          router.push("/creator/dashboard");
        },
        onPending: (result: any) => {
          console.log("Payment pending:", result);
          setError(
            "Payment is pending. Please complete your payment to create the contest.",
          );
          setIsSubmitting(false);
        },
        onError: (result: any) => {
          console.error("Payment error:", result);
          setError("Payment failed. Please try again.");
          setIsSubmitting(false);
        },
        onClose: () => {
          console.log("Payment popup closed without finishing.");
          // Jangan set error jika pengguna hanya menutupnya
          setIsSubmitting(false);
        },
      });
    } catch (err: any) {
      console.error("HandleSubmit Error:", err);
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-black bg-pink-500">
        <div className="mx-auto max-w-4xl px-4 py-4">
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
              <h1 className="text-3xl font-black text-white uppercase">
                Create New Contest
              </h1>
              <p className="text-pink-100 font-bold">
                Set up a content clipping contest for your audience
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="bg-yellow-400">
              <CardTitle className="text-xl font-black uppercase">
                Basic Information
              </CardTitle>
              <CardDescription className="font-bold text-black">
                Set up the core details of your contest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-black uppercase">
                  Contest Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Best Gaming Highlights Contest"
                  value={contestData.title}
                  onChange={(e) =>
                    setContestData({ ...contestData, title: e.target.value })
                  }
                  className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="font-black uppercase">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what kind of clips you're looking for..."
                  value={contestData.description}
                  onChange={(e) =>
                    setContestData({
                      ...contestData,
                      description: e.target.value,
                    })
                  }
                  className="border-4 border-black bg-white min-h-[120px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prize_pool" className="font-black uppercase">
                  Prize Amount (USD) *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
                  <Input
                    id="prize_pool"
                    type="number"
                    placeholder="500"
                    value={contestData.prize_pool}
                    onChange={(e) =>
                      setContestData({
                        ...contestData,
                        prize_pool: e.target.value,
                      })
                    }
                    className="border-4 border-black bg-white pl-10 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Winning Condition Card */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="bg-cyan-400">
              <CardTitle className="text-xl font-black uppercase">
                Winning Condition
              </CardTitle>
              <CardDescription className="font-bold text-black">
                Set the target that clippers must reach to win.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-black uppercase">Target Metric</Label>
                  <Select
                    value={contestData.rules.win_condition.metric}
                    onValueChange={(value) =>
                      handleRulesChange("win_condition.metric", value)
                    }
                  >
                    <SelectTrigger className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-4 border-black bg-white">
                      <SelectItem value="view_count">Views</SelectItem>
                      <SelectItem value="like_count">Likes</SelectItem>
                      <SelectItem value="comment_count">Comments</SelectItem>
                      <SelectItem value="share_count">Shares</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="target-value"
                    className="font-black uppercase"
                  >
                    Target Value
                  </Label>
                  <Input
                    id="target-value"
                    type="number"
                    placeholder="e.g., 10000"
                    value={contestData.rules.win_condition.target}
                    onChange={(e) =>
                      handleRulesChange(
                        "win_condition.target",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Duration & Payout Card */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="bg-yellow-400">
              <CardTitle className="text-xl font-black uppercase">
                Payout & Duration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label className="font-black uppercase">Payout Type</Label>
                <Select
                  value={contestData.rules.payout.type}
                  onValueChange={(value) =>
                    handleRulesChange("payout.type", value)
                  }
                >
                  <SelectTrigger className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-4 border-black bg-white">
                    <SelectItem value="winner_takes_all">
                      Winner Takes All
                    </SelectItem>
                    <SelectItem value="split_top_3">
                      Split Between Top 3
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {contestData.rules.payout.type === "split_top_3" && (
                <div className="space-y-2">
                  <Label className="font-black uppercase">
                    Prize Split (1st, 2nd, 3rd)
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="60%"
                      className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                    <Input
                      type="number"
                      placeholder="25%"
                      className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                    <Input
                      type="number"
                      placeholder="15%"
                      className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label className="font-black uppercase">
                  Contest Duration Type
                </Label>
                <Select
                  value={contestData.rules.duration.type}
                  onValueChange={(value) =>
                    handleRulesChange("duration.type", value)
                  }
                >
                  <SelectTrigger className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-4 border-black bg-white">
                    <SelectItem value="fixed">Fixed Duration</SelectItem>
                    <SelectItem value="ends_on_winner">
                      Ends When Winner is Found
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {contestData.rules.duration.type === "fixed" ? (
                <div className="space-y-2">
                  <Label className="font-black uppercase">
                    Set Duration (Days)
                  </Label>
                  <Input
                    type="number"
                    value={contestData.rules.duration.days}
                    onChange={(e) =>
                      handleRulesChange(
                        "duration.days",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="font-black uppercase">
                    Max Duration Failsafe (Days)
                  </Label>
                  <Input
                    type="number"
                    value={contestData.rules.duration.max_days}
                    onChange={(e) =>
                      handleRulesChange(
                        "duration.max_days",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                  <p className="text-xs text-muted-foreground font-bold">
                    Kontes akan otomatis berakhir setelah durasi ini jika tidak
                    ada pemenang.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform & Requirements */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="bg-pink-500">
              <CardTitle className="text-xl font-black uppercase text-white">
                Platform & Requirements
              </CardTitle>
              <CardDescription className="font-bold text-pink-100">
                Specify where clips should be posted and any special
                requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label className="font-black uppercase">
                  Allowed Platforms *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {platformsOptions.map((platform) => (
                    <Button
                      key={platform.id}
                      type="button"
                      variant={
                        contestData.platforms.includes(platform.id)
                          ? "default"
                          : "outline"
                      }
                      className={`border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${contestData.platforms.includes(platform.id) ? "bg-yellow-400 text-black hover:bg-yellow-300" : "bg-white text-black hover:bg-cyan-400"}`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <platform.icon className="mr-2 h-4 w-4" />
                      {platform.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements" className="font-black uppercase">
                  Specific Requirements
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="e.g., Clips must be 15-60 seconds, include captions..."
                  value={contestData.requirements}
                  onChange={(e) =>
                    setContestData({
                      ...contestData,
                      requirements: e.target.value,
                    })
                  }
                  className="border-4 border-black bg-white min-h-[120px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
              <div className="space-y-3">
                <Label className="font-black uppercase">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="bg-accent text-accent-foreground font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {contestData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm font-black uppercase bg-pink-500 text-white"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardContent className="p-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Alert className="border-4 border-black bg-pink-500 text-white">
                <Info className="h-4 w-4" />
                <AlertDescription className="font-bold">
                  Your contest will be live immediately after creation. Make
                  sure all details are correct.
                </AlertDescription>
              </Alert>
              <div className="mt-6 flex gap-4">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !contestData.title ||
                    !contestData.description ||
                    !contestData.prize_pool
                  }
                  className="bg-pink-500 text-white hover:bg-pink-400 font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
                >
                  {isSubmitting ? "Creating Contest..." : "Create Contest"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
