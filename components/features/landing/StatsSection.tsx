export default function StatsSection() {
  const stats = [
    {
      number: "1JT+",
      label: "Potensi Jangkauan Penonton",
      color: "bg-pink-400",
    },
    {
      number: "^100%",
      label: "Kontes Baru Diluncurkan",
      color: "bg-yellow-400",
    },
    {
      number: "On Time",
      label: "Hadiah Terbayar Tepat Waktu",
      color: "bg-cyan-400",
    },
    {
      number: "100%",
      label: "Tanpa Biaya",
      color: "Untuk Bergabung",
    },
  ];

  return (
    <section className="py-20 px-4 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-balance">
            #1 satu-satunya cliper contest contest
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto text-pretty">
            Bergabung dengan ribuan creator yang sudah merasakan kesuksesan
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:scale-110 transition-transform duration-300"
            >
              <div
                className={`${stat.color} w-20 h-20 rounded-full border-4 border-white flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300`}
              >
                <span className="text-2xl">🎮</span>
              </div>
              <div className="text-4xl md:text-5xl font-black mb-2 text-white">
                {stat.number}
              </div>
              <div className="text-lg font-bold text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
