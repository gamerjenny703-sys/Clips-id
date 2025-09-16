import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UserEarnings from "@/components/features/payment/UserEarnings";

export default async function EarningsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", user.id)
    .single();
  const initialBalance = profile?.balance ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-black uppercase mb-8">My Earnings</h1>
      <UserEarnings initialBalance={initialBalance} />
    </div>
  );
}
