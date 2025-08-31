"use client";

import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Banknote, DollarSign } from "lucide-react";

type UserEarningsProps = {
  initialBalance: number;
};
export default function UserEarnings({ initialBalance }: UserEarningsProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bankCode: "",
    accountNumber: "",
    accountName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const amountToPayout = parseFloat(payoutAmount);

    if (isNaN(amountToPayout) || amountToPayout <= 0) {
      setError("Please enter a valid amount.");
      setIsSubmitting(false);
      return;
    }

    if (amountToPayout > balance) {
      setError("Withdrawal amount cannot exceed your available balance.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/payout/midtrans/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountToPayout,
          bankDetails: bankDetails,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "An unknown error occurred.");
      }

      setSuccess(
        result.message ||
          "Your payout request has been submitted successfully!",
      );
      setBalance(balance - amountToPayout); // Kurangi saldo di UI
      setPayoutAmount(""); // Reset form
      setBankDetails({ bankCode: "", accountNumber: "", accountName: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="font-black uppercase">Request Payout</CardTitle>
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
                placeholder="e.g., BCA, Mandiri, etc."
                value={bankDetails.bankCode}
                onChange={handleInputChange}
                required
                className="border-2 border-black"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="accountName" className="font-bold">
                Account Holder Name
              </Label>
              <Input
                id="accountName"
                placeholder="John Doe"
                value={bankDetails.accountName}
                onChange={handleInputChange}
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
                value={bankDetails.accountNumber}
                onChange={handleInputChange}
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
  );
}
