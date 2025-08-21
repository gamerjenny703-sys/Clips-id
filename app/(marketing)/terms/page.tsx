// app/(marketing)/terms/page.tsx

import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black uppercase text-black mb-2">
              Terms of Service
            </h1>
            <p className="text-black font-bold">
              LAST UPDATED: August 21, 2025
            </p>
          </div>

          <div className="space-y-6 text-black font-bold prose prose-lg">
            <p className="text-red-600 font-black">
              PLEASE NOTE: These Terms of Service are a placeholder for
              development and app review purposes. The official terms will be
              published upon the official launch of Clips.ID.
            </p>

            <h2 className="font-black uppercase">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Clips.ID platform, you agree to be bound
              by these terms. This document outlines the rules for using our
              marketplace.
            </p>

            <h2 className="font-black uppercase">2. The Service</h2>
            <p>
              Clips.ID provides a two-sided marketplace connecting Content
              Creators who host contests and Clippers who submit video clips to
              win performance-based prizes.
            </p>

            <h2 className="font-black uppercase">3. User Accounts</h2>
            <p>
              Users are responsible for maintaining the confidentiality of their
              account and password. You must be of legal age to create an
              account and participate in contests.
            </p>

            <h2 className="font-black uppercase">4. Contest Rules</h2>
            <p>
              All contests hosted on Clips.ID are subject to the rules defined
              by the Content Creator, including prize pool, winning conditions,
              and duration. Clips.ID acts as a facilitator and escrow agent for
              the prize pool.
            </p>

            <h2 className="font-black uppercase">5. Content Ownership</h2>
            <p>
              Clippers retain ownership of the content they create and submit.
              However, by submitting a clip, you grant the Content Creator a
              license to use the content as per the contest rules.
            </p>

            <h2 className="font-black uppercase">6. Limitation of Liability</h2>
            <p>
              The Clips.ID platform is provided "as is". We are not responsible
              for any disputes between Creators and Clippers. Final legal terms
              will be provided at launch.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
