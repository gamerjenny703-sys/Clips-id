import { Card } from "@/components/ui/card";

export default function ValuesSection() {
  return (
    <section className="bg-black text-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-5xl font-black uppercase text-center mb-16">
          OUR <span className="text-cyan-400">VALUES</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "BOLD OVER BORING",
              description:
                "WE BELIEVE DESIGN SHOULD MAKE PEOPLE STOP AND STARE, NOT SCROLL PAST.",
              color: "bg-yellow-400",
            },
            {
              title: "RESULTS OVER PRETTY",
              description:
                "BEAUTIFUL DESIGN MEANS NOTHING IF IT DOESN'T CONVERT. WE DESIGN FOR IMPACT.",
              color: "bg-pink-500",
            },
            {
              title: "HONEST COMMUNICATION",
              description:
                "NO BS, NO FLUFF. WE TELL YOU EXACTLY WHAT YOU NEED TO HEAR.",
              color: "bg-cyan-400",
            },
            {
              title: "RELENTLESS IMPROVEMENT",
              description:
                "GOOD ENOUGH ISN'T GOOD ENOUGH. WE PUSH BOUNDARIES EVERY SINGLE DAY.",
              color: "bg-yellow-400",
            },
          ].map((value, index) => (
            <Card
              key={index}
              className={`${value.color} border-4 border-white p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all`}
            >
              <h3 className="text-2xl font-black uppercase mb-4 text-black">
                {value.title}
              </h3>
              <p className="font-bold text-black">{value.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
