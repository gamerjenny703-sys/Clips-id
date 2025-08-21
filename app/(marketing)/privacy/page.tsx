// app/(marketing)/privacy/page.tsx

import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black uppercase text-black mb-2">
              Privacy Policy
            </h1>
            <p className="text-black font-bold">
              LAST UPDATED: August 21, 2025
            </p>
          </div>

          <div className="space-y-6 text-black font-bold prose prose-lg">
            <p className="text-red-600 font-black">
              PLEASE NOTE: This Privacy Policy is a placeholder for development
              and app review purposes. The official policy will be published
              upon the official launch of Clips.ID.
            </p>

            <h2 className="font-black uppercase">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when
              you create an account (email, name). We also collect information
              when you connect your social media accounts (e.g., YouTube,
              TikTok) via OAuth, limited to the scopes you approve.
            </p>

            <h2 className="font-black uppercase">
              2. How We Use Your Information
            </h2>
            <p>
              We use the information to operate, maintain, and provide the
              features of the Clips.ID service, including:
            </p>
            <ul>
              <li>To manage your account and authentication.</li>
              <li>To allow you to participate in contests.</li>
              <li>
                To facilitate the automated tracking of video metrics via APIs
                for contest judging.
              </li>
              <li>To process payments and payouts.</li>
            </ul>

            <h2 className="font-black uppercase">3. Data Sharing</h2>
            <p>
              We do not sell your personal data. Your information may be shared
              with contest creators (e.g., your username) when you submit a
              clip. Payment information is handled by our third-party payment
              processor (e.g., Stripe).
            </p>

            <h2 className="font-black uppercase">4. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal
              information at any time through your account settings page. You
              can also disconnect your social media accounts at any time.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
