export default function StatsSection() {
  const stats = [
    { number: "1,200+", label: "KLIP DI-SUBMIT" },
    { number: "$25,000+", label: "TOTAL HADIAH" },
    { number: "500+", label: "KONTES DIBUAT" },
    { number: "0", label: "BIAYA TERSEMBUNYI" },
  ];

  return (
    <section className="bg-yellow-400 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="text-5xl font-black mb-2">{stat.number}</div>
              <div className="font-bold uppercase text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
