// components/features/contest/SaveContestButton.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Asumsi: Anda akan membuat tabel 'saved_contests' dengan kolom 'user_id' and 'contest_id'
// CREATE TABLE public.saved_contests (
//   user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
//   contest_id bigint NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
//   created_at timestamptz NOT NULL DEFAULT now(),
//   PRIMARY KEY (user_id, contest_id)
// );
// ALTER TABLE public.saved_contests ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users can manage their own saved contests" ON public.saved_contests FOR ALL USING (auth.uid() = user_id);

export default function SaveContestButton({
  contestId,
}: {
  contestId: number;
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please sign in to save contests.");
      setIsLoading(false);
      return;
    }

    // Logika untuk menyimpan atau menghapus simpanan
    if (isSaved) {
      // Logika untuk unsave (menghapus dari DB)
      // const { error } = await supabase.from('saved_contests').delete().match({ user_id: user.id, contest_id: contestId });
      console.log("Unsaved");
      setIsSaved(false);
    } else {
      // Logika untuk save (menambahkan ke DB)
      // const { error } = await supabase.from('saved_contests').insert({ user_id: user.id, contest_id: contestId });
      console.log("Saved");
      setIsSaved(true);
    }

    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleSave}
      disabled={isLoading}
      className="w-full bg-white text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      {isSaved ? (
        <BookmarkCheck className="mr-2 h-4 w-4" />
      ) : (
        <Bookmark className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "SAVING..." : isSaved ? "CONTEST SAVED" : "SAVE CONTEST"}
    </Button>
  );
}
