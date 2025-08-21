import { Card } from "@/components/ui/card";
import { Zap, Shield, Target } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "BAYARAN BERBASIS PERFORMA",
      description:
        "Clippers dibayar berdasarkan views, likes, dan engagement. Semakin viral, semakin besar pendapatanmu.",
      color: "bg-yellow-400",
    },
    {
      icon: Shield,
      title: "DANA AMAN (ESCROW)",
      description:
        "Prize pool disimpan dengan aman oleh Clips.ID dan dicairkan secara otomatis saat pemenang ditentukan oleh sistem.",
      color: "bg-pink-500",
    },
    {
      icon: Target,
      title: "PELACAKAN OTOMATIS",
      description:
        "Sistem kami melacak metrik video dari YouTube & TikTok secara real-time. Tidak perlu lagi laporan manual.",
      color: "bg-cyan-400",
    },
  ];

  return (
    <section className="bg-black text-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-5xl font-black uppercase text-center mb-16">
          KENAPA MEMILIH <span className="text-yellow-400">CLIPS.ID?</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`${feature.color} border-4 border-white p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transform hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all`}
            >
              <feature.icon className="h-12 w-12 mb-4 text-black" />
              <h3 className="text-2xl font-black uppercase mb-4 text-black">
                {feature.title}
              </h3>
              <p className="font-bold text-black">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
