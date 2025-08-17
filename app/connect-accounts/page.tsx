"use client";
import SocialOAuth from "@/components/features/social/social-oauth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ConnectAccountsPage() {
  return (
    <div className="min-h-screen bg-yellow-400">
      <header className="border-b-4 border-black bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/user/dashboard">
              <Button className="bg-pink-500 text-white border-4 border-white hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK TO DASHBOARD
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-black uppercase text-white">
                CONNECT SOCIAL ACCOUNTS
              </h1>
              <p className="text-white font-bold uppercase">
                LINK YOUR SOCIAL MEDIA ACCOUNTS TO START PARTICIPATING IN
                CONTESTS
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase text-black mb-4">
              AVAILABLE PLATFORMS
            </h2>
            <p className="text-black font-bold">
              Connect your accounts to start submitting clips and earning
              rewards!
            </p>
          </div>

          <SocialOAuth
            showStats={true}
            onConnect={(platform) => {
              console.log(`[v0] Connecting to ${platform}`);
              // Handle OAuth initiation
            }}
            onDisconnect={(platform) => {
              console.log(`[v0] Disconnecting from ${platform}`);
              // Handle account disconnection
            }}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-pink-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <h3 className="text-xl font-black uppercase text-white mb-2">
                EARN REWARDS
              </h3>
              <p className="text-white font-bold">
                Win contests and earn money from your clips
              </p>
            </div>
            <div className="bg-cyan-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <h3 className="text-xl font-black uppercase text-black mb-2">
                TRACK PROGRESS
              </h3>
              <p className="text-black font-bold">
                Monitor your performance across platforms
              </p>
            </div>
            <div className="bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <h3 className="text-xl font-black uppercase text-black mb-2">
                JOIN CONTESTS
              </h3>
              <p className="text-black font-bold">
                Participate in exciting clipping challenges
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
