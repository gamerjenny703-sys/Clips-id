import Link from "next/link";
import { Button } from "@/components/ui/button";
import ContestList from "@/components/features/contest/ContestList";

// Komponen ini sekarang adalah Server Component, tidak perlu "use client"
export default async function WorkPage() {
  return (
    <>
      <section className="bg-black text-white py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-black uppercase mb-8">
            MAKE <span className="text-yellow-400">CLIPPER</span> GOOD
          </h1>
          <p className="text-xl font-bold max-w-3xl mx-auto">
            PROJECTS THAT DON'T JUST LOOK GOOD - THEY DOMINATE THEIR MARKETS AND
            CRUSH THE COMPETITION.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <ContestList />
      {/* CTA Section */}
      <section className="bg-pink-500 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-5xl font-black uppercase mb-8 text-white">
            READY FOR YOUR
            <br />
            <span className="text-black">BRUTAL PROJECT?</span>
          </h2>

          <Link href="/contact">
            <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase text-xl px-12 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              START YOUR PROJECT
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
