import { Button } from "@/components/ui/button";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Daftar sebagai Creator",
      description:
        "Buat akun dan upload konten gaming terbaik kamu. Semakin viral, semakin besar peluang menang!",
      color: "bg-pink-400",
    },
    {
      number: "02",
      title: "Clipper Pilih Konten",
      description:
        "Para clipper profesional akan memilih momen terbaik dari konten kamu untuk dijadikan clip viral.",
      color: "bg-yellow-400",
    },
    {
      number: "03",
      title: "Kompetisi & Menang",
      description:
        "Clip terbaik akan berkompetisi. Creator dengan clip paling viral berhak mendapat hadiah jutaan rupiah!",
      color: "bg-cyan-400",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">
            Cara Kerja Platform
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto text-pretty">
            Tiga langkah mudah untuk mulai berkompetisi dan menang besar di
            Clips.ID
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 h-full">
                <div
                  className={`${step.color} w-16 h-16 rounded-full border-4 border-black flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300`}
                >
                  <span className="text-2xl font-black text-black">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-black mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-pink-400 hover:bg-pink-500 text-black font-black text-lg px-8 py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all duration-200">
            Mulai Sekarang →
          </Button>
        </div>
      </div>
    </section>
  );
}
