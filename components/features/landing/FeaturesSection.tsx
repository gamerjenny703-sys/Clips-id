import { Card } from "@/components/ui/card";
import { Zap, Shield, Target } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Kompetisi Berhadiah Besar",
      description:
        "Setiap bulan ada kompetisi dengan total hadiah puluhan juta rupiah. Semakin viral clip kamu, semakin besar peluang menang!",
      icon: "🏆",
      color: "bg-pink-400",
    },
    {
      title: "Clipper Profesional",
      description:
        "Tim clipper berpengalaman yang tahu cara bikin konten kamu jadi viral di semua platform media sosial.",
      icon: "✂️",
      color: "bg-yellow-400",
    },
    {
      title: "Pembayaran Cepat",
      description:
        "Hadiah langsung ditransfer ke rekening kamu maksimal 7 hari setelah pengumuman pemenang. No ribet!",
      icon: "💰",
      color: "bg-cyan-400",
    },
    {
      title: "Multi Platform",
      description:
        "Clip kamu akan disebarkan ke TikTok, Instagram, YouTube Shorts, dan platform lainnya untuk maksimal exposure.",
      icon: "📱",
      color: "bg-green-400",
    },
    {
      title: "Analytics Lengkap",
      description:
        "Pantau performa clip kamu dengan dashboard analytics yang detail. Lihat views, engagement, dan potensi hadiah.",
      icon: "📊",
      color: "bg-purple-400",
    },
    {
      title: "Community Support",
      description:
        "Bergabung dengan komunitas creator gaming terbesar Indonesia. Sharing tips, kolaborasi, dan saling support!",
      icon: "👥",
      color: "bg-orange-400",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">
            Kenapa Creator Pilih Clips.ID?
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto text-pretty">
            Platform terlengkap untuk creator gaming yang ingin kontennya viral
            dan menang kompetisi berhadiah besar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 h-full group-hover:shadow-[12px_12px_0px_0px_#000] transition-shadow duration-300">
                <div
                  className={`${feature.color} w-16 h-16 rounded-full border-4 border-black flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300`}
                >
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-black text-black mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
