import Layout from "../components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Star, Zap, Shield, Target } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <Layout>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-black text-6xl md:text-8xl font-black uppercase leading-none mb-6">
                CLIP
                <br />
                <span className="text-pink-500">YOUR</span>
                <br />
                CONTENT
              </h1>
              <p className="text-xl font-bold mb-8 max-w-lg">
                MAKE YOUR FACE ANYWHERE ANYMOMENT ANYTIME, GET EVERYBODY EYES
                AND TIME
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button className="bg-pink-500 text-white border-4 border-black hover:bg-black font-black uppercase text-lg px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    START WORK
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/work">
                  <Button
                    variant="outline"
                    className="border-4 border-black bg-white text-black hover:bg-yellow-400 font-black uppercase text-lg px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  >
                    VIEW WORK
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-cyan-400 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
                <div className="bg-white border-4 border-black p-6 transform -rotate-1">
                  <div className="text-4xl font-black uppercase mb-4">100%</div>
                  <div className="font-bold uppercase">
                    SATISFACTION GUARANTEED
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-12">
                <Star className="h-8 w-8" fill="black" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-black text-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-5xl font-black uppercase text-center mb-16">
            WHY CHOOSE <span className="text-yellow-400">BRUTAL?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((feature, index) => (
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

      {/* Stats Section */}
      <section className="bg-yellow-400 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "PROJECTS COMPLETED" },
              { number: "99%", label: "CLIENT SATISFACTION" },
              { number: "24/7", label: "SUPPORT AVAILABLE" },
              { number: "0", label: "BORING WEBSITES" },
            ].map((stat, index) => (
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

      {/* CTA Section */}
      <section className="bg-pink-500 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 text-white">
            READY TO GO
            <br />
            <span className="text-black">BRUTAL?</span>
          </h2>
          <p className="text-xl font-bold mb-12 text-white max-w-2xl mx-auto">
            JOIN THE REVOLUTION. GET A WEBSITE THAT DOESN'T JUST EXIST - IT
            DOMINATES.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Input
              placeholder="YOUR EMAIL ADDRESS"
              className="border-4 border-black bg-white text-black placeholder:text-gray-600 font-bold uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
            <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
              LET'S GO!
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
