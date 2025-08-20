"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SaveContestButton({
  contestId,
  isInitiallySaved,
}: {
  contestId: number;
  isInitiallySaved: boolean;
}) {
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsSaved(isInitiallySaved);
  }, [isInitiallySaved]);

  const handleSaveToggle = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    if (isSaved) {
      const { error } = await supabase
        .from("saved_contests")
        .delete()
        .match({ user_id: user.id, contest_id: contestId });
      if (!error) setIsSaved(false);
    } else {
      const { error } = await supabase
        .from("saved_contests")
        .insert({ user_id: user.id, contest_id: contestId });
      if (!error) setIsSaved(true);
    }

    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleSaveToggle}
      disabled={isLoading}
      className="w-full bg-white text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      {isSaved ? (
        <BookmarkCheck className="mr-2 h-4 w-4" />
      ) : (
        <Bookmark className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "UPDATING..." : isSaved ? "CONTEST SAVED" : "SAVE CONTEST"}
    </Button>
  );
}
