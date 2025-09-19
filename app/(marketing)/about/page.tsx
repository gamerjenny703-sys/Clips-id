import AboutHeroSection from "@/components/features/about/AboutHeroSection";
import StatsSection from "@/components/features/about/StatsSection";
import TeamSection from "@/components/features/about/TeamSection";
import ValuesSection from "@/components/features/about/ValuesSection";
import AboutCtaSection from "@/components/features/about/AboutCtaSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <div className="text-lg leading-relaxed text-gray-800 space-y-6">
              <p className="text-xl font-semibold text-black">
                Dear Community,
              </p>

              <p>
                When I first started gaming, I never imagined that those
                late-night sessions would lead to building something that could
                change how creators connect with their audiences. But here we
                are, and I couldn't be more excited about what we've built
                together.
              </p>

              <p>
                <span className="font-bold text-cyan-600">
                  Our platform was born from a simple frustration:
                </span>{" "}
                talented creators were struggling to monetize their skills while
                audiences craved authentic, engaging content. Traditional
                platforms took huge cuts, offered little creative freedom, and
                made it nearly impossible for new creators to break through.
              </p>

              <p>
                We decided to change that. Our mission is simple but powerful:{" "}
                <span className="font-bold text-pink-600">
                  empower every creator to turn their passion into profit
                </span>{" "}
                while giving audiences the most entertaining content possible.
              </p>

              <p>
                What makes us different? We believe in fair revenue sharing,
                transparent contests, and building genuine communities around
                shared interests. Every feature we build, every decision we
                make, comes back to one question: "Does this help creators
                succeed?"
              </p>

              <p>
                <span className="font-bold text-yellow-600">
                  The numbers speak for themselves:
                </span>{" "}
                Over 10,000 creators have already earned through our platform,
                with total payouts exceeding $2.5 million. But more importantly,
                we've helped build careers, fund dreams, and create connections
                that go far beyond gaming.
              </p>

              <p>
                This is just the beginning. We're working on features that will
                revolutionize how contests work, how creators collaborate, and
                how audiences engage with content. The future of creator economy
                is bright, and we're building it together.
              </p>

              <p>
                Thank you for being part of this journey. Whether you're a
                creator pushing boundaries or a fan supporting your favorites,
                you're the reason we exist.
              </p>

              <p className="text-xl font-semibold text-black">
                Keep creating, keep competing, keep winning.
              </p>

              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-black text-lg text-black">
                      Muhammad syaddad
                    </p>
                    <p className="text-sm text-gray-500">Just Human being</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
