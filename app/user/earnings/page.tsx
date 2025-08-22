"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Banknote, Landmark, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EarningsPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [bankInfo, setBankInfo] = useState({
    bankCode: "",
    accountNumber: "",
    accountName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/sign-in");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (profile) {
        setBalance(profile.balance);
      }
      setLoading(false);
    };
    fetchBalance();
  }, [router]);

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    if (parseFloat(payoutAmount) > balance) {
      setError("Withdrawal amount cannot exceed your available balance.");
      setIsSubmitting(false);
      return;
    }

    // Panggil API backend untuk proses payout
    // (API ini akan kita buat di langkah selanjutnya)
    // const response = await fetch('/api/payouts/midtrans/request', { ... });

    // Simulasi sementara
    await new Promise((res) => setTimeout(res, 2000));
    setSuccess(
      "Your payout request has been submitted and is being processed.",
    );
    setBalance(balance - parseFloat(payoutAmount));
    setPayoutAmount("");

    setIsSubmitting(false);
  };

  if (loading) return <p>Loading earnings...</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-black uppercase mb-8">My Earnings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Balance Card */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-black uppercase">
              <Banknote /> Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-black">${balance.toFixed(2)}</p>
          </CardContent>
        </Card>

        {/* Payout Form */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="font-black uppercase">
              Request Payout
            </CardTitle>
            <CardDescription className="font-bold">
              Withdraw your earnings to your bank account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayout} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-100 border-green-500">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1">
                <Label htmlFor="bankCode" className="font-bold">
                  Bank Name
                </Label>
                <Input
                  id="bankCode"
                  placeholder="e.g., BCA"
                  required
                  className="border-2 border-black"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="accountNumber" className="font-bold">
                  Account Number
                </Label>
                <Input
                  id="accountNumber"
                  placeholder="1234567890"
                  required
                  className="border-2 border-black"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="payoutAmount" className="font-bold">
                  Amount to Withdraw
                </Label>
                <Input
                  id="payoutAmount"
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder={`Max $${balance.toFixed(2)}`}
                  required
                  className="border-2 border-black"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-500 text-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {isSubmitting ? "Processing..." : "Request Payout"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
