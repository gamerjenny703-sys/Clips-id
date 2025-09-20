import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqSection() {
  const faqs = [
    {
      question: "Bagaimana cara mendaftar sebagai creator?",
      answer:
        "Cukup klik tombol 'Daftar Sekarang', isi data diri, dan upload konten gaming terbaik kamu. Proses verifikasi hanya butuh 1-2 hari kerja.",
    },
    {
      question: "Berapa besar hadiah yang bisa didapat?",
      answer:
        "Hadiah bervariasi mulai dari 1 juta hingga 50 juta rupiah per kompetisi, tergantung tingkat viral dan engagement clip kamu.",
    },
    {
      question: "Apakah ada biaya untuk bergabung?",
      answer:
        "Tidak ada biaya sama sekali! Clips.ID 100% gratis untuk creator. Kamu bahkan bisa dapat hadiah tanpa mengeluarkan modal.",
    },
    {
      question: "Game apa saja yang bisa diikutkan?",
      answer:
        "Semua game populer seperti Mobile Legends, PUBG Mobile, Free Fire, Valorant, Genshin Impact, dan masih banyak lagi.",
    },
    {
      question: "Kapan hadiah dibayarkan?",
      answer:
        "Hadiah dibayarkan maksimal 7 hari setelah pengumuman pemenang melalui transfer bank atau e-wallet.",
    },
    {
      question: "Bisakah satu creator menang berkali-kali?",
      answer:
        "Tentu saja! Tidak ada batasan menang. Semakin konsisten upload konten berkualitas, semakin besar peluang menang terus.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">
            Pertanyaan yang Sering Ditanya
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto text-pretty">
            Punya pertanyaan? Kami punya jawabannya!
          </p>
        </div>

        <div className="bg-gray-50 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b-2 border-black"
              >
                <AccordionTrigger className="text-left text-lg font-black text-black hover:text-pink-600 transition-colors duration-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg leading-relaxed pt-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
