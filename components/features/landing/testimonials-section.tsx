import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "My Mom",
      role: "Content Creator",
      content:
        "Gila! Clip Mobile Legends gue jadi viral dan dapet hadiah 5 juta! Clipper di sini emang pro banget.",
      rating: 5,
      avatar: "/Emak-Emak.png",
      color: "bg-pink-400",
    },
    {
      name: "My Dad",
      role: "Professional Clipper",
      content:
        "Platform terbaik buat clipper! Banyak konten berkualitas dan sistem pembayarannya transparan.",
      rating: 5,
      avatar: "/Bapak-Bapak.png",
      color: "bg-yellow-400",
    },
    {
      name: "My friends",
      role: "Content Creator",
      content:
        "Dari konten biasa jadi viral berkat clipper handal. Sekarang subscriber naik 10x lipat!",
      rating: 5,
      avatar: "/Anak-Muda.png",
      color: "bg-cyan-400",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">
            Kata Mereka Tentang Clips.ID
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto text-pretty">
            Ribuan creator dan clipper sudah merasakan kesuksesan bersama kami
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 h-full group-hover:shadow-[12px_12px_0px_0px_#000] transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div
                    className={`${testimonial.color} w-16 h-16 rounded-full border-4 border-black flex items-center justify-center mr-4 group-hover:rotate-6 transition-transform duration-300`}
                  >
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-black">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 font-bold">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-700 text-lg leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
