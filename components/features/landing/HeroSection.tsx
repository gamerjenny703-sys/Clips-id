import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-black text-6xl md:text-8xl font-black uppercase leading-none mb-6">
              CLIP
              <br />
              <span className="text-pink-500">YOUR</span>
              <br />
              CONTENT
            </h1>
            <p className="text-xl font-bold mb-8 max-w-lg">
              MAKE YOUR FACE ANYWHERE ANYMOMENT ANYTIME, GET EVERYBODY EYES AND
              TIME
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button className="bg-pink-500 text-white border-4 border-black hover:bg-black font-black uppercase text-lg px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  START WORK
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/work">
                <Button
                  variant="outline"
                  className="border-4 border-black bg-white text-black hover:bg-yellow-400 font-black uppercase text-lg px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                  VIEW WORK
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-cyan-400 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
              <div className="bg-white border-4 border-black p-6 transform -rotate-1">
                <div className="text-4xl font-black uppercase mb-4">100%</div>
                <div className="font-bold uppercase">
                  SATISFACTION GUARANTEED
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-yellow-400 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-12">
              <Star className="h-8 w-8" fill="black" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
