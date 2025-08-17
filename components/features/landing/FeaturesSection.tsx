import { Card } from "@/components/ui/card";
import { Zap, Shield, Target } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "LIGHTNING FAST",
      description:
        "WEBSITES THAT LOAD IN MILLISECONDS, NOT MINUTES. SPEED IS EVERYTHING.",
      color: "bg-yellow-400",
    },
    {
      icon: Shield,
      title: "BULLETPROOF",
      description:
        "SECURE, RELIABLE, AND BUILT TO WITHSTAND ANYTHING THE INTERNET THROWS AT IT.",
      color: "bg-pink-500",
    },
    {
      icon: Target,
      title: "CONVERSION FOCUSED",
      description:
        "EVERY PIXEL DESIGNED TO TURN VISITORS INTO CUSTOMERS. RESULTS GUARANTEED.",
      color: "bg-cyan-400",
    },
  ];

  return (
    <section className="bg-black text-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-5xl font-black uppercase text-center mb-16">
          WHY CHOOSE <span className="text-yellow-400">BRUTAL?</span>
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
