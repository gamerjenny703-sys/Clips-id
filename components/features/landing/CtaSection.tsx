import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-pink-500 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 text-white">
          SIAP UNTUK
          <br />
          <span className="text-black">BERGABUNG?</span>
        </h2>
        <p className="text-xl font-bold mb-12 text-white max-w-2xl mx-auto">
          JADILAH BAGIAN DARI REVOLUSI KONTEN. BAIK ANDA SEORANG KREATOR ATAUPUN
          CLIPPER, KESEMPATAN MENANTI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/creator/dashboard">
            <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase text-lg px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
              SAYA KREATOR
            </Button>
          </Link>
          <Link href="/work">
            <Button className="bg-white text-black border-4 border-black hover:bg-yellow-400 font-black uppercase text-lg px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
              SAYA CLIPPER
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
