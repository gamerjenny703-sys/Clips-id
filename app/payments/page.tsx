"use client";
import PaymentSystem from "@/components/payment/payment-system";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/user/dashboard">
              <Button className="bg-yellow-400 text-black border-4 border-white hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK TO DASHBOARD
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-black uppercase text-white">
                PAYMENT CENTER
              </h1>
              <p className="text-white font-bold">
                MANAGE YOUR EARNINGS, DEPOSITS, AND PAYMENT METHODS
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12 bg-white">
        <PaymentSystem
          userType="user"
          onPaymentComplete={(transaction) => {
            console.log("[v0] Payment completed:", transaction);
          }}
        />
      </div>
    </div>
  );
}
