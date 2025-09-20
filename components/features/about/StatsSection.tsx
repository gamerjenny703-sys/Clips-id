import { Card } from "@/components/ui/card";
import { Users, Award, Coffee, Zap } from "lucide-react";

export default function StatsSection() {
  const stats = [
    { icon: Users, number: "1JT+", label: "Potensi Jangkauan Penonton" },
    { icon: Award, number: "50+", label: "DESIGN AWARDS" },
    { icon: Coffee, number: "10K+", label: "CUPS OF COFFEE" },
    { icon: Zap, number: "1M+", label: "LINES OF CODE" },
  ];

  return (
    <section className="bg-yellow-400 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-5xl font-black uppercase text-center mb-16">
          BY THE NUMBERS
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <stat.icon className="h-12 w-12 mx-auto mb-4" />
              <div className="text-4xl font-black mb-2">{stat.number}</div>
              <div className="font-bold uppercase text-sm">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
