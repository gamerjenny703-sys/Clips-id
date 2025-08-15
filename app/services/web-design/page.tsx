import Layout from "../../../components/layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Zap, Palette, Code, Smartphone } from "lucide-react"
import Link from "next/link"

export default function WebDesignPage() {
  const features = [
    "CUSTOM DESIGN SYSTEM",
    "RESPONSIVE ACROSS ALL DEVICES",
    "LIGHTNING-FAST LOADING TIMES",
    "SEO OPTIMIZED FROM DAY ONE",
    "CONVERSION-FOCUSED LAYOUTS",
    "ACCESSIBILITY COMPLIANT",
    "UNLIMITED REVISIONS",
    "6 MONTHS FREE SUPPORT",
  ]

  const process = [
    {
      step: "01",
      title: "DISCOVERY",
      description: "WE DIG DEEP INTO YOUR BUSINESS, GOALS, AND COMPETITION",
      icon: Zap,
      color: "bg-yellow-400",
    },
    {
      step: "02",
      title: "DESIGN",
      description: "WE CREATE BOLD, BRUTAL DESIGNS THAT DEMAND ATTENTION",
      icon: Palette,
      color: "bg-pink-500",
    },
    {
      step: "03",
      title: "DEVELOP",
      description: "WE BUILD FAST, SECURE, AND SCALABLE WEBSITES",
      icon: Code,
      color: "bg-cyan-400",
    },
    {
      step: "04",
      title: "DEPLOY",
      description: "WE LAUNCH YOUR SITE AND OPTIMIZE FOR MAXIMUM IMPACT",
      icon: Smartphone,
      color: "bg-yellow-400",
    },
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-8">
                WEB
                <br />
                <span className="text-yellow-400">DESIGN</span>
                <br />
                THAT KILLS
              </h1>
              <p className="text-xl font-bold mb-8">
                FORGET BORING TEMPLATES. WE CREATE CUSTOM WEBSITES THAT STOP VISITORS IN THEIR TRACKS AND CONVERT LIKE
                CRAZY.
              </p>
              <Link href="/contact">
                <Button className="bg-pink-500 text-white border-4 border-white hover:bg-white hover:text-black font-black uppercase text-lg px-8 py-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                  START PROJECT
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-yellow-400 border-4 border-white p-8 shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transform rotate-2">
                <div className="text-4xl font-black mb-4">300%</div>
                <div className="font-bold uppercase">AVERAGE CONVERSION INCREASE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-yellow-400 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-5xl font-black uppercase text-center mb-16">WHAT YOU GET</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <CheckCircle className="h-8 w-8 mb-4 text-green-600" />
                <div className="font-black uppercase text-sm">{feature}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-5xl font-black uppercase text-center mb-16">
            OUR <span className="text-pink-500">BRUTAL</span> PROCESS
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <Card
                key={index}
                className={`${step.color} border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
              >
                <div className="text-4xl font-black mb-4">{step.step}</div>
                <step.icon className="h-12 w-12 mx-auto mb-4 text-black" />
                <h3 className="text-xl font-black uppercase mb-3 text-black">{step.title}</h3>
                <p className="font-bold text-black text-sm">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-black text-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-5xl font-black uppercase text-center mb-16">
            BRUTAL <span className="text-cyan-400">PRICING</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "STARTER",
                price: "$15K",
                description: "PERFECT FOR SMALL BUSINESSES READY TO MAKE AN IMPACT",
                features: ["5 PAGES", "CUSTOM DESIGN", "MOBILE RESPONSIVE", "BASIC SEO", "3 MONTHS SUPPORT"],
                color: "bg-yellow-400",
                popular: false,
              },
              {
                name: "PROFESSIONAL",
                price: "$35K",
                description: "FOR BUSINESSES SERIOUS ABOUT DOMINATING THEIR MARKET",
                features: [
                  "15 PAGES",
                  "ADVANCED DESIGN SYSTEM",
                  "E-COMMERCE READY",
                  "ADVANCED SEO",
                  "6 MONTHS SUPPORT",
                  "ANALYTICS SETUP",
                ],
                color: "bg-pink-500",
                popular: true,
              },
              {
                name: "ENTERPRISE",
                price: "$75K+",
                description: "FOR COMPANIES THAT DEMAND THE ABSOLUTE BEST",
                features: [
                  "UNLIMITED PAGES",
                  "CUSTOM FUNCTIONALITY",
                  "ADVANCED INTEGRATIONS",
                  "PRIORITY SUPPORT",
                  "12 MONTHS SUPPORT",
                  "DEDICATED TEAM",
                ],
                color: "bg-cyan-400",
                popular: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`${plan.color} border-4 border-white p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 border-4 border-white font-black uppercase text-sm">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black uppercase mb-2 text-black">{plan.name}</h3>
                  <div className="text-4xl font-black mb-4 text-black">{plan.price}</div>
                  <p className="font-bold text-black text-sm">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-black flex-shrink-0" />
                      <span className="font-bold text-black text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <Button className="w-full bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    GET STARTED
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-500 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-5xl font-black uppercase mb-8 text-white">
            READY FOR A
            <br />
            <span className="text-black">BRUTAL WEBSITE?</span>
          </h2>
          <p className="text-xl font-bold mb-8 text-white">STOP SETTLING FOR BORING. GET A WEBSITE THAT CONVERTS.</p>
          <Link href="/contact">
            <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase text-xl px-12 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              START YOUR PROJECT
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  )
}
