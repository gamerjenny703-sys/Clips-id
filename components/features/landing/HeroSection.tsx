import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <span className="inline-block bg-yellow-400 text-black font-black px-6 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#000] text-lg animate-bounce">
            🏆 KOMPETISI CREATOR TERBESAR!
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-black mb-6 text-balance">
          KONTEN GAMING KAMU
          <span className="block text-pink-600">BISA MENANG JUTAAN!</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto text-pretty">
          Platform pertama di Indonesia yang menghubungkan content creator
          gaming dengan clipper profesional. Upload konten, biarkan clipper
          bikin viral, menang kompetisi berhadiah puluhan juta!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="bg-pink-400 hover:bg-pink-500 text-black font-black text-xl px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200 hover:scale-105">
            DAFTAR JADI CREATOR →
          </button>
          <button className="bg-white hover:bg-gray-100 text-black font-black text-xl px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200 hover:scale-105">
            LIHAT HADIAH 💰
          </button>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="font-bold">4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="font-bold">15K+ Creator</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span className="font-bold">₹2.5M+ Hadiah</span>
          </div>
        </div>
      </div>
    </section>
  );
}
