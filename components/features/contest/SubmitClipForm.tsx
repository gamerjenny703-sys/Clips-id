// components/features/contest/SubmitClipForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Link as LinkIcon, PlusCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SubmissionEntry = {
  platform: string;
  video_url: string;
};

type SubmitClipFormProps = {
  contestId: number;
  clipperId: string;
  allowedPlatforms: string[];
  connectedPlatforms: { platform: string; username: string }[];
};

export default function SubmitClipForm({
  contestId,
  clipperId,
  allowedPlatforms,
  connectedPlatforms,
}: SubmitClipFormProps) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([
    { platform: "", video_url: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const availablePlatforms = connectedPlatforms.filter((p) =>
    allowedPlatforms.includes(p.platform.toLowerCase()),
  );

  const handleAddLink = () => {
    setSubmissions([...submissions, { platform: "", video_url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    const newSubmissions = submissions.filter((_, i) => i !== index);
    setSubmissions(newSubmissions);
  };

  const handleUpdateLink = (
    index: number,
    field: keyof SubmissionEntry,
    value: string,
  ) => {
    const newSubmissions = [...submissions];
    newSubmissions[index][field] = value;
    setSubmissions(newSubmissions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const validSubmissions = submissions.filter(
      (s) => s.platform && s.video_url,
    );

    if (validSubmissions.length === 0) {
      setError("Please add at least one valid clip link and platform.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const submissionsToInsert = validSubmissions.map((s) => ({
      contest_id: contestId,
      clipper_id: clipperId,
      ...s,
    }));

    const { error: insertError } = await supabase
      .from("submissions")
      .insert(submissionsToInsert);

    if (insertError) {
      setError(insertError.message);
    } else {
      console.log("Submissions successful!");
      router.push("/user/dashboard");
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-red-500 font-bold p-2 bg-red-100 border-2 border-red-500">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {submissions.map((submission, index) => (
          <div
            key={index}
            className="flex items-end gap-2 p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 rounded-lg"
          >
            <div className="flex-grow grid grid-cols-5 gap-2">
              <div className="col-span-2">
                <label className="text-xs font-black uppercase">
                  Platform *
                </label>
                <Select
                  value={submission.platform}
                  onValueChange={(value) =>
                    handleUpdateLink(index, "platform", value)
                  }
                >
                  <SelectTrigger className="border-2 border-black font-bold">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlatforms.map((p) => (
                      <SelectItem key={p.platform} value={p.platform}>
                        {p.platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <label className="text-xs font-black uppercase">
                  Clip URL *
                </label>
                <Input
                  value={submission.video_url}
                  onChange={(e) =>
                    handleUpdateLink(index, "video_url", e.target.value)
                  }
                  placeholder="https://..."
                  className="border-2 border-black font-bold"
                  required
                />
              </div>
            </div>
            {submissions.length > 1 && (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => handleRemoveLink(index)}
                className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={handleAddLink}
          variant="outline"
          className="font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Link
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-grow bg-pink-500 text-white border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-12 text-lg"
        >
          <Upload className="mr-2 h-5 w-5" />
          {isLoading ? "SUBMITTING..." : `SUBMIT ${submissions.length} CLIP(S)`}
        </Button>
      </div>
    </form>
  );
}
