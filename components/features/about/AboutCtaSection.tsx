import { Button } from "@/components/ui/button";
import { Users, Award, Coffee, Zap } from "lucide-react";
import Link from "next/link";
export default function AboutCtaSection() {
  return (
    <section className="bg-pink-500 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-5xl font-black uppercase mb-8 text-white">
          READY TO JOIN
          <br />
          <span className="text-black">THE REVOLUTION?</span>
        </h2>
        <Link href="/contact">
          <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase text-xl px-12 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            WORK WITH US
          </Button>
        </Link>
      </div>
    </section>
  );
}
