// components/features/contest/UnsaveContestButton.tsx

"use server"; // Menandakan bahwa fungsi di file ini bisa jadi Server Actions

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import UnsaveButtonClient from "./UnsaveButtonClient"; // Komponen client terpisah

async function unsaveContestAction(contestId: number) {
  "use server"; // Ini adalah Server Action
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Seharusnya tidak terjadi jika user sudah di dashboard, tapi ini untuk keamanan
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("saved_contests")
    .delete()
    .match({ user_id: user.id, contest_id: contestId });

  if (error) {
    console.error("Error unsaving contest:", error);
    throw new Error("Could not unsave contest.");
  }

  // Penting! Ini akan memberitahu Next.js untuk memuat ulang data di halaman dashboard
  revalidatePath("/user/dashboard");
}

export default function UnsaveContestButton({
  contestId,
}: {
  contestId: number;
}) {
  // Kita bungkus logic client dalam komponen terpisah untuk memisahkan server/client concerns
  const unsaveWithId = unsaveContestAction.bind(null, contestId);

  return <UnsaveButtonClient action={unsaveWithId} />;
}
