"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function  updateContestPaymentStatus(contestId: number ) {
    const supabase = createClient();
    const {error} = await supabase
        .from("contests")
        .update({
            status: "active",
            payment_status: "paid",
            paid_at: new Date().toISOString(),
        })
        .eq ("id", contestId);
    if (error){
        console.log("error pas ngapdate payment status", error);
        throw new Error("gagal ngapdate payment status ");
    }
    revalidatePath("/creator/dashboard");
    revalidatePath(`/creator/contest/${contestId}/manage`);
}