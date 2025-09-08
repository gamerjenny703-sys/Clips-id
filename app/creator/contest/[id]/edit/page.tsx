// app/creator/contest/[id]/edit/page.tsx

"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

// Tipe data ini bisa dipindahkan ke file terpusat seperti `lib/types.ts` nantinya
type ContestData = {
  title: string;
  description: string;
  prize_pool: string;
  thumbnail_url: string;
  rules: {
    win_condition: {
      metric: string;
      target: number;
    };
    payout: {
      type: string;
      split_ratio: number[];
    };
    duration: {
      type: string;
      days: number;
      max_days: number;
    };
  };
  platforms: string[];
  requirements: string;
  tags: string[];
  video: {
    type: "none" | "file" | "youtube_link";
    filePath: string;
    fileSize: number;
    youtubeLink: string;
  };
};

export default function EditContestPage() {
  const router = useRouter();
  const params = useParams();
  const contestId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [contestData, setContestData] = useState<ContestData | null>(null);
  const [targetInput, setTargetInput] = useState('');
  const [durationDaysInput, setDurationDaysInput] = useState('');
  const [durationMaxDaysInput, setDurationMaxDaysInput] = useState('');
  const [winnersCountInput, setWinnersCountInput] = useState('');

  // Fetch existing contest data on component mount
  useEffect(() => {
    if (!contestId) return;

    const fetchContest = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contests")
        .select("*")
        .eq("id", contestId)
        .single();

      if (error || !data) {
        setError("Failed to fetch contest data. It might not exist or you don't have permission.");
        console.error(error);
        setIsLoading(false);
        return;
      }

      // Populate state with fetched data
      setContestData({
        title: data.title,
        description: data.description || "",
        prize_pool: String(data.prize_pool),
        thumbnail_url: data.thumbnail_url || "",
        rules: data.rules || { win_condition: {}, payout: {}, duration: {} },
        platforms: data.requirements?.platforms || [],
        requirements: data.requirements?.custom || "",
        tags: data.requirements?.tags || [],
        video: {
            type: data.video_upload_type || "none",
            filePath: data.video_file_path || "",
            fileSize: data.video_file_size || 0,
            youtubeLink: data.youtube_link || "",
        },
      });

      setTagsInput((data.requirements?.tags || []).map((t: string) => `#${t}`).join(' '));
      setTargetInput(String(data.rules?.win_condition?.target || ''));
      setDurationDaysInput(String(data.rules?.duration?.days || ''));
      setDurationMaxDaysInput(String(data.rules?.duration?.max_days || ''));
      setWinnersCountInput(String(data.rules?.payout?.split_ratio?.length || '1'));
      setIsLoading(false);
    };

    fetchContest();
  }, [contestId]);

  const handleContestDataChange = (field: keyof ContestData, value: any) => {
    setContestData((prev) => (prev ? { ...prev, [field]: value } : null));
  };
  
  const handleRulesChange = (path: string, value: any) => {
    setContestData((prev) => {
      if (!prev) return null;
      const keys = path.split(".");
      let current = { ...prev.rules } as any;
      let ruleRef = current;
      for (let i = 0; i < keys.length - 1; i++) {
        ruleRef = ruleRef[keys[i]];
      }
      ruleRef[keys[keys.length - 1]] = value;
      return { ...prev, rules: current };
    });
  };

  const togglePlatform = (platformId: string) => {
    if (!contestData) return;
    const platforms = contestData.platforms.includes(platformId)
      ? contestData.platforms.filter((p) => p !== platformId)
      : [...contestData.platforms, platformId];
    handleContestDataChange('platforms', platforms);
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTagsInput(value);
    const parsedTags = value.split("#").slice(1).map((tag) => tag.trim()).filter(Boolean);
    handleContestDataChange('tags', parsedTags);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contestData) {
      setError("Contest data is not loaded.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in to update a contest.");
      setIsSubmitting(false);
      return;
    }

    try {
      let publicUrl = contestData.thumbnail_url;

      if (thumbnailFile) {
        const fileExtension = thumbnailFile.name.split(".").pop();
        const fileName = `${user.id}/${contestData.title.replace(/\s+/g, '_').toLowerCase()}-${Date.now()}.${fileExtension}`;
        
        const { error: uploadError } = await supabase.storage
          .from("contest-thumbnails")
          .upload(fileName, thumbnailFile, { upsert: true });

        if (uploadError) throw uploadError;

        publicUrl = supabase.storage.from("contest-thumbnails").getPublicUrl(fileName).data.publicUrl;
      }

      const endDate = new Date();
      const durationDays = contestData.rules.duration.type === "fixed"
          ? contestData.rules.duration.days
          : contestData.rules.duration.max_days;
      endDate.setDate(endDate.getDate() + durationDays);

      const { error: updateError } = await supabase
        .from("contests")
        .update({
          title: contestData.title,
          description: contestData.description,
          prize_pool: parseFloat(contestData.prize_pool),
          end_date: endDate.toISOString(),
          thumbnail_url: publicUrl,
          rules: contestData.rules,
          requirements: {
            platforms: contestData.platforms,
            tags: contestData.tags,
            custom: contestData.requirements,
          },
          video_file_path: contestData.video.type === "file" ? contestData.video.filePath : null,
          video_file_size: contestData.video.type === "file" ? contestData.video.fileSize : null,
          youtube_link: contestData.video.type === "youtube_link" ? contestData.video.youtubeLink : null,
          video_upload_type: contestData.video.type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", contestId);

      if (updateError) throw updateError;

      alert("Contest updated successfully!");
      router.push("/creator/dashboard");
      router.refresh();

    } catch (err: any) {
      console.error("HandleSubmit Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-3xl font-black text-black uppercase">Loading Contest Data...</h1>
      </div>
    );
  }

  if (error && !contestData) {
     return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-black text-red-500 uppercase mb-4">Error</h1>
            <p className="font-bold text-center mb-6">{error}</p>
            <Link href="/creator/dashboard">
                <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </Link>
        </div>
    );
  }

  if (!contestData) return null; // or another fallback UI

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
                Edit Contest
              </h1>
              <p className="text-pink-100 font-bold">
                Update the details for: {contestData.title}
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
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-black uppercase">Contest Title *</Label>
                <Input
                  id="title"
                  value={contestData.title}
                  onChange={(e) => handleContestDataChange('title', e.target.value)}
                  className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="font-black uppercase">Description *</Label>
                <Textarea
                  id="description"
                  value={contestData.description}
                  onChange={(e) => handleContestDataChange('description', e.target.value)}
                  className="border-4 border-black bg-white min-h-[120px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prize_pool" className="font-black uppercase">Prize Amount (IDR) *</Label>
                <Input
                  id="prize_pool"
                  type="number"
                  min="1000"
                  step="1000"
                  value={contestData.prize_pool}
                  onChange={(e) => handleContestDataChange('prize_pool', e.target.value)}
                  className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
              </div>
            </CardContent>
          </Card>
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <CardHeader className="bg-cyan-400">
                <CardTitle className="text-xl font-black uppercase">
                    Winning Condition
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <Label className="font-black uppercase">Target Metric</Label>
                    <Select
                        value={contestData.rules.win_condition.metric}
                        onValueChange={(value) => handleRulesChange("win_condition.metric", value)}
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
                    <Label htmlFor="target-value" className="font-black uppercase">Target Value</Label>
                    <Input
                        id="target-value"
                        type="number"
                        min="1"
                        value={targetInput}
                        onChange={(e) => setTargetInput(e.target.value)}
                        onBlur={(e) => handleRulesChange("win_condition.target", Math.max(1, parseInt(e.target.value, 10) || 1))}
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
                    {/* Payout Type Logic */}
                    <div className="space-y-2">
                        <Label className="font-black uppercase">Payout Type</Label>
                        <Select
                            value={contestData.rules.payout.type}
                            onValueChange={(value) => handleRulesChange("payout.type", value)}
                        >
                            <SelectTrigger className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-4 border-black bg-white">
                                <SelectItem value="winner_takes_all">Winner Takes All</SelectItem>
                                <SelectItem value="split_top_3">Split Between Top 3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {/* Duration Logic */}
                    <div className="space-y-2">
                        <Label className="font-black uppercase">Contest Duration Type</Label>
                        <Select
                            value={contestData.rules.duration.type}
                            onValueChange={(value) => handleRulesChange("duration.type", value)}
                        >
                            <SelectTrigger className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-4 border-black bg-white">
                                <SelectItem value="fixed">Fixed Duration</SelectItem>
                                <SelectItem value="ends_on_winner">Ends When Winner is Found</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {contestData.rules.duration.type === "fixed" ? (
                        <div className="space-y-2">
                        <Label className="font-black uppercase">Set Duration (Days)</Label>
                        <Input
                            type="number" min="1" max="365"
                            value={durationDaysInput}
                            onChange={(e) => setDurationDaysInput(e.target.value)}
                            onBlur={(e) => handleRulesChange("duration.days", Math.max(1, parseInt(e.target.value, 10) || 1))}
                            className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            required
                        />
                        </div>
                    ) : (
                        <div className="space-y-2">
                        <Label className="font-black uppercase">Max Duration Failsafe (Days)</Label>
                        <Input
                            type="number" min="1" max="365"
                            value={durationMaxDaysInput}
                            onChange={(e) => setDurationMaxDaysInput(e.target.value)}
                            onBlur={(e) => handleRulesChange("duration.max_days", Math.max(1, parseInt(e.target.value, 10) || 1))}
                            className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            required
                        />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Video Upload - (Logikanya sudah ada di komponennya, tidak perlu diubah) */}
        <VideoUpload
            onVideoChange={(videoData) => {
                handleContestDataChange('video', {
                    type: videoData.type,
                    filePath: videoData.filePath || "",
                    fileSize: videoData.fileSize || 0,
                    youtubeLink: videoData.youtubeLink || "",
                });
            }}
        />
          
          {/* winning condition, payout, duration, etc. cards go here */}
          {/* ... Salin semua JSX Card dari halaman `new` ... */}

          <ThumbnailUpload
            onFileSelect={setThumbnailFile}
            onUploadComplete={() => {}}
            onUploadStart={() => {}}
            onUploadError={() => {}}
          />

          {/* ... Salin Card "Platform & Requirements" ... */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="bg-pink-500">
                <CardTitle className="text-xl font-black uppercase text-white">Platform & Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <div className="space-y-3">
                <Label className="font-black uppercase">Allowed Platforms *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { id: "youtube", name: "YouTube", icon: Youtube },
                        { id: "tiktok", name: "TikTok", icon: Instagram },
                    ].map((platform) => (
                        <Button
                        key={platform.id}
                        type="button"
                        variant={contestData.platforms.includes(platform.id) ? "default" : "outline"}
                        className={`border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                            contestData.platforms.includes(platform.id)
                            ? "bg-yellow-400 text-black hover:bg-yellow-300"
                            : "bg-white text-black hover:bg-cyan-400"
                        }`}
                        onClick={() => togglePlatform(platform.id)}
                        >
                        <platform.icon className="mr-2 h-4 w-4" />
                        {platform.name}
                        </Button>
                    ))}
                </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="requirements" className="font-black uppercase">Specific Requirements</Label>
                <Textarea
                    id="requirements"
                    value={contestData.requirements}
                    onChange={(e) => handleContestDataChange('requirements', e.target.value)}
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
                    <Badge key={index} variant="secondary" className="text-sm font-black uppercase bg-pink-500 text-white">
                        {tag}
                    </Badge>
                    ))}
                </div>
                </div>
            </CardContent>
        </Card>

        
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
                    Changes will be saved immediately. Make sure all details are correct.
                  </AlertDescription>
                </Alert>
              </div>
              <div className="mt-6 flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-pink-500 text-white hover:bg-pink-400 font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
                >
                  {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}