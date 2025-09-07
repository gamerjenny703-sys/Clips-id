"use client";

import type React from "react";
import { use, useEffect, useState } from "react";
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
  Info,
  Youtube,
  Instagram,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import VideoUpload from "@/components/features/contest/VideoUpload";
import ThumbnailUpload from "@/components/features/contest/ThumbnailUpload";

declare global {
  interface Window {
    snap: any;
  }
}

export default function CreateContestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [contestData, setContestData] = useState({
    title: "",
    description: "",
    prize_pool: "",
    thumbnail_url: "",
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
        days: 0,
        max_days: 0,
      },
    },
    platforms: [] as string[],
    requirements: "",
    tags: [] as string[],
    video: {
      type: "none" as "none" | "file" | "youtube_link",
      filePath: "",
      fileSize: 0,
      youtubeLink: "",
    },
  });
  const [targetInput, setTargetInput] = useState(
    String(
      typeof contestData.rules.win_condition.target === "number"
        ? contestData.rules.win_condition.target
        : 0,
    ),
  );
  const [durationDaysInput, setDurationDaysInput] = useState(
    String(
      typeof contestData.rules.duration.days === "number"
        ? contestData.rules.duration.days
        : 0,
    ),
  );
  const [durationMaxDaysInput, setDurationMaxDaysInput] = useState(
    String(
      typeof contestData.rules.duration.max_days === "number"
        ? contestData.rules.duration.max_days
        : 0,
    ),
  );
  const [winnersCountInput, setWinnersCountInput] = useState(
    String(Math.max(1, contestData.rules.payout?.split_ratio?.length || 1)),
  );
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

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTagsInput(value);

    const parsedTags = value
      .split("#")
      .slice(1)
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    setContestData((prev) => ({
      ...prev,
      tags: parsedTags,
    }));
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

  const validateForm = () => {
    // Basic validation
    if (!contestData.title.trim()) {
      return "Contest title is required.";
    }

    if (!contestData.description.trim()) {
      return "Contest description is required.";
    }

    if (!contestData.prize_pool || parseFloat(contestData.prize_pool) < 1000) {
      return "Prize amount must be at least Rp 1,000.";
    }

    if (contestData.rules.win_condition.target < 1) {
      return "Target value must be at least 1.";
    }

    if (
      contestData.rules.duration.type === "fixed" &&
      (contestData.rules.duration.days === 0 ||
        contestData.rules.duration.days < 1 ||
        contestData.rules.duration.days > 365)
    ) {
      return "Fixed duration must be between 1-365 days.";
    }

    if (
      contestData.rules.duration.type === "ends_on_winner" &&
      (contestData.rules.duration.max_days === 0 ||
        contestData.rules.duration.max_days < 1 ||
        contestData.rules.duration.max_days > 365)
    ) {
      return "Max duration must be between 1-365 days.";
    }

    if (contestData.platforms.length === 0) {
      return "Please select at least one platform.";
    }

    if (contestData.video.type === "none") {
      return "Please upload a video or provide a YouTube link for your contest.";
    }

    return null; // No errors
  };

  // app/creator/contest/new/page.tsx

  // ... (setelah semua state)
  const handleSubmit = async (e:React.FormEvent) =>{
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const validationError = validateForm();

    if (validationError){
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    if (!thumbnailFile){
      setError("Contest thumbnail is required");
      setIsSubmitting(false);
      return;
    }

    const supabase = createClient();
    const {data : {user}} = await supabase.auth.getUser();
    if (!user){
      setError("u must be logged in.");
      setIsSubmitting(false);
      return;
    } 

    try {
      console.log("uploading thumbnail...");
      const fileExtension = thumbnailFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExtension}`;
      
      const {error:uploadError} = await supabase.storage
        .from("contests-thumbnails")
        .upload(fileName, thumbnailFile);

      if (uploadError) throw uploadError;

      const {data:{ publicUrl}} = supabase.storage.from("contests-thumbnails").getPublicUrl(fileName);
      console.log("Thumbnail uploaded successfully", publicUrl);

      console.log ("Saving Contest with pending payment status....");
      const endDate = new Date();
      const durationDays =
        contestData.rules.duration.type === "fixed"
          ? contestData.rules.duration.days
          : contestData.rules.duration.max_days;
        endDate.setDate(endDate.getDate() + durationDays);
      
      const {data: contest, error: insertError} = await supabase
        .from("contests")
        .insert({
          title: contestData.title,
          description:contestData.description,
          prize_pool: parseFloat(contestData.prize_pool),
          creator_id: user.id,
          endDate: endDate.toISOString(),
          thumbnail_url: publicUrl,
          rules: contestData.rules,
          requirements:{
            platforms: contestData.platforms,
            tags: contestData.tags,
            custom: contestData.requirements,
          },
          video_file_path:
            contestData.video.type === "file"
              ? contestData.video.filePath
              : null,
          video_file_size:
            contestData.video.type === "file"
              ? contestData.video.fileSize
              : null,
          youtube_link:
            contestData.video.type === "youtube_link"
              ? contestData.video.youtubeLink
              : null,
          video_upload_type: contestData.video.type,
          status: "pending_payment",
          payment_status:"pending",
        })
        .select()
        .single();
      
      if (insertError) throw Error(insertError.message);
      console.log("contest saved with ID:", contest.id);

      console.log("Requesting payment token");
      const response = await fetch ("/api/payments/midtrans/create-token", {
        method:"POST",
        headers:{"Content-Type" : "application/json"},
        body: JSON.stringify({
          amount: parseFloat(contestData.prize_pool),
          contestTittle: contestData.title,
          contestId: contest.id,
          user: {
            first_name: user.user_metadata?.full_name || "Users",
            email: user.email,
          },
        }),
      });

      const paymentData = await response.json();
      if (!response.ok || !paymentData.token){
        throw new Error (paymentData.error || "Failed to create payment token. ");
      }

      if (window.snap){
        window.snap.pay(paymentData.token,{
          onSucces: function (result:any) {
            console.log ("Payment Succes", result);
            alert("Payment Succesfull! Your Content is now Active. ");
            router.push(`/creator/contest/${contest.id}/manage`);
          },
          onPending: function (result:any){
            console.log ("Payment Pending", result);
            alert("waiting for your payment");
            router.push('/creator/dashboard');
          },
          onError: function (result:any){
            console.log ("Payment Error", result);
            setError("payment failed. please try again from the dashboard. ");
            setIsSubmitting(false);
          },
          onClose: function (result:any){
            console.log ("You closed the popup without finishing the payment, You can complete from your dashboard");
            router.push(`/creator/dashboard`);
            setIsSubmitting(false);
          },
        });
      } else {
        throw new Error ("midtrans Snap.js is not loaded yet ." );
      }
      

    } catch (err: any){
      console.log("Handlesubmit Error", err);
      setError(err.massage);
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
                className=" py-5 border-4 border-black bg-white hover:bg-yellow-400 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <ArrowLeft className=" h-6 w-4" />
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
                  Prize Amount (IDR) *
                </Label>
                <div className="relative">
                  <Input
                    id="prize_pool"
                    type="number"
                    min="1000"
                    step="1000"
                    placeholder="7500000"
                    value={contestData.prize_pool}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        value === "" ||
                        (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))
                      ) {
                        setContestData({
                          ...contestData,
                          prize_pool: value,
                        });
                      }
                    }}
                    onBlur={(e) => {
                      // Ensure minimum value on blur only if not empty
                      const value = e.target.value;
                      if (value !== "" && parseFloat(value) < 1000) {
                        setContestData({
                          ...contestData,
                          prize_pool: "1000",
                        });
                      }
                    }}
                    className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    required
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground font-bold">
                      Minimum prize amount: Rp 1,000
                    </p>
                    {contestData.prize_pool &&
                      parseFloat(contestData.prize_pool) > 0 && (
                        <p className="text-xs text-blue-600 font-bold">
                          💰 Prize Pool: Rp{" "}
                          {parseFloat(contestData.prize_pool).toLocaleString(
                            "id-ID",
                          )}
                        </p>
                      )}
                  </div>
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
                    min="1"
                    step="1"
                    placeholder="e.g., 10000"
                    value={targetInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTargetInput(value);
                      if (value === "") {
                        // Keep UI empty; set numeric state to 0 for validation
                        handleRulesChange("win_condition.target", 0);
                        return;
                      }
                      const parsed = parseInt(value, 10);
                      if (!Number.isNaN(parsed) && parsed >= 0) {
                        handleRulesChange("win_condition.target", parsed);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value !== "") {
                        const parsed = parseInt(value, 10);
                        if (!Number.isNaN(parsed) && parsed < 1) {
                          setTargetInput("1");
                          handleRulesChange("win_condition.target", 1);
                        }
                      }
                    }}
                    className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    required
                  />
                  <p className="text-xs text-muted-foreground font-bold mt-1">
                    Minimum target: 1
                  </p>
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
                  onValueChange={(value) => {
                    // Update payout type
                    handleRulesChange("payout.type", value);
                    // Initialize custom split to 1 winner by default
                    if (value === "custom") {
                      setContestData({
                        ...contestData,
                        rules: {
                          ...contestData.rules,
                          payout: {
                            ...contestData.rules.payout,
                            split_ratio: [1],
                          },
                        },
                      });
                    }
                  }}
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
                    <SelectItem value="custom">Custom Split</SelectItem>
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
              {contestData.rules.payout.type === "custom" && (
                <div className="space-y-2">
                  <Label className="font-black uppercase">
                    Number of Winners
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={winnersCountInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        setWinnersCountInput(value);
                        if (value === "") return; // show empty while editing
                        let n = parseInt(value, 10);
                        if (Number.isNaN(n) || n < 1) n = 1;
                        const equal = Array.from({ length: n }, () => 1 / n);
                        setContestData({
                          ...contestData,
                          rules: {
                            ...contestData.rules,
                            payout: {
                              ...contestData.rules.payout,
                              split_ratio: equal,
                            },
                          },
                        });
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setWinnersCountInput("1");
                          const equal = [1];
                          setContestData({
                            ...contestData,
                            rules: {
                              ...contestData.rules,
                              payout: {
                                ...contestData.rules.payout,
                                split_ratio: equal,
                              },
                            },
                          });
                          return;
                        }
                        let n = parseInt(value, 10);
                        if (Number.isNaN(n) || n < 1) n = 1;
                        const equal = Array.from({ length: n }, () => 1 / n);
                        setWinnersCountInput(String(n));
                        setContestData({
                          ...contestData,
                          rules: {
                            ...contestData.rules,
                            payout: {
                              ...contestData.rules.payout,
                              split_ratio: equal,
                            },
                          },
                        });
                      }}
                      className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-28"
                    />
                    <div className="text-xs font-bold text-muted-foreground">
                      Each gets:{" "}
                      {(() => {
                        const n = Math.max(
                          1,
                          contestData.rules.payout.split_ratio?.length || 1,
                        );
                        const amount = parseFloat(
                          contestData.prize_pool || "0",
                        );
                        const per = n > 0 ? amount / n : 0;
                        return `Rp ${Number.isFinite(per) ? per.toLocaleString("id-ID") : "0"}`;
                      })()}{" "}
                      (
                      {(() => {
                        const n = Math.max(
                          1,
                          contestData.rules.payout.split_ratio?.length || 1,
                        );
                        return `${(100 / n).toFixed(2)}%`;
                      })()}
                      )
                    </div>
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
                    min="1"
                    max="365"
                    step="1"
                    value={durationDaysInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDurationDaysInput(value);
                      if (value === "") {
                        handleRulesChange("duration.days", 0);
                        return;
                      }
                      const parsed = parseInt(value, 10);
                      if (!Number.isNaN(parsed)) {
                        handleRulesChange("duration.days", parsed);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value !== "") {
                        let parsed = parseInt(value, 10);
                        if (Number.isNaN(parsed)) {
                          parsed = 1;
                        }
                        if (parsed < 1) parsed = 1;
                        if (parsed > 365) parsed = 365;
                        setDurationDaysInput(String(parsed));
                        handleRulesChange("duration.days", parsed);
                      }
                    }}
                    className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    required
                  />
                  <p className="text-xs text-muted-foreground font-bold mt-1">
                    Duration range: 1-365 days
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="font-black uppercase">
                    Max Duration Failsafe (Days)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    step="1"
                    value={durationMaxDaysInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDurationMaxDaysInput(value);
                      if (value === "") {
                        handleRulesChange("duration.max_days", 0);
                        return;
                      }
                      const parsed = parseInt(value, 10);
                      if (!Number.isNaN(parsed)) {
                        handleRulesChange("duration.max_days", parsed);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value !== "") {
                        let parsed = parseInt(value, 10);
                        if (Number.isNaN(parsed)) {
                          parsed = 1;
                        }
                        if (parsed < 1) parsed = 1;
                        if (parsed > 365) parsed = 365;
                        setDurationMaxDaysInput(String(parsed));
                        handleRulesChange("duration.max_days", parsed);
                      }
                    }}
                    className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    required
                  />
                  <p className="text-xs text-muted-foreground font-bold mt-1">
                    Duration range: 1-365 days
                  </p>
                  <p className="text-xs text-muted-foreground font-bold">
                    Kontes akan otomatis berakhir setelah durasi ini jika tidak
                    ada pemenang.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Upload */}
          <VideoUpload
            onVideoChange={(videoData) => {
              setContestData({
                ...contestData,
                video: {
                  type: videoData.type,
                  filePath: videoData.filePath || "",
                  fileSize: videoData.fileSize || 0,
                  youtubeLink: videoData.youtubeLink || "",
                },
              });
            }}
          />
          <ThumbnailUpload
            onUploadComplete={(filePath) => {
              // Fungsi ini sebenarnya tidak kita gunakan lagi untuk upload,
              // tapi kita bisa pakai untuk menyimpan URL sementara jika perlu.
              // Logika utama ada di onFileSelect.
            }}
            onUploadStart={() => {}}
            onUploadError={() => {}}
            onFileSelect={setThumbnailFile} // Ini yang terpenting!
          />

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
                  {platformsOptions.map((platform) => {
                    const isDisabled =
                      platform.id === "twitter" || platform.id === "instagram";
                    const isActive = contestData.platforms.includes(
                      platform.id,
                    );
                    return (
                      <Button
                        key={platform.id}
                        type="button"
                        disabled={isDisabled}
                        variant={isActive ? "default" : "outline"}
                        className={`border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative ${
                          isDisabled
                            ? "bg-white text-black opacity-60 cursor-not-allowed"
                            : isActive
                              ? "bg-yellow-400 text-black hover:bg-yellow-300"
                              : "bg-white text-black hover:bg-cyan-400"
                        }`}
                        onClick={() => {
                          if (isDisabled) return;
                          togglePlatform(platform.id);
                        }}
                      >
                        <platform.icon className="mr-2 h-4 w-4" />
                        {platform.name}
                      </Button>
                    );
                  })}
                </div>
                {contestData.platforms.length === 0 && (
                  <p className="text-xs text-red-500 font-bold">
                    Please select at least one platform.
                  </p>
                )}
                <p className="text-xs text-muted-foreground font-bold">
                  Select where participants can post their clips
                </p>
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
                <Input
                  placeholder="Gunakan # untuk setiap tag, contoh: #gaming #funny"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
                <div className="flex flex-wrap gap-2">
                  {contestData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm font-black uppercase bg-pink-500 text-white"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground font-bold">
                  Setiap Kata tanda # akan di hitung sebagai tags
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {error && (
                  <Alert variant="destructive">
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

                {contestData.prize_pool &&
                  parseFloat(contestData.prize_pool) > 0 && (
                    <Alert className="border-4 border-black bg-blue-500 text-white">
                      <Info className="h-4 w-4" />
                      <AlertDescription className="font-bold">
                        💳 Payment will be processed in Indonesian Rupiah (IDR).
                        Amount: Rp{" "}
                        {parseFloat(contestData.prize_pool).toLocaleString(
                          "id-ID",
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
              </div>

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
