import Layout from "../../components/layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Award, Coffee, Zap } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const team = [
    {
      name: "ALEX BRUTAL",
      role: "FOUNDER & CEO",
      description: "FORMER GOOGLE DESIGNER WHO GOT TIRED OF BORING WEBSITES",
      image: "/placeholder.svg?height=300&width=300",
      color: "bg-yellow-400",
    },
    {
      name: "SARAH BOLD",
      role: "CREATIVE DIRECTOR",
      description: "AWARD-WINNING DESIGNER WITH ZERO TOLERANCE FOR BLAND",
      image: "/placeholder.svg?height=300&width=300",
      color: "bg-pink-500",
    },
    {
      name: "MIKE SAVAGE",
      role: "LEAD DEVELOPER",
      description: "FULL-STACK WIZARD WHO MAKES IMPOSSIBLE THINGS POSSIBLE",
      image: "/placeholder.svg?height=300&width=300",
      color: "bg-cyan-400",
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
                WE ARE
                <br />
                <span className="text-yellow-400">BRUTAL</span>
              </h1>
              <p className="text-xl font-bold mb-8">
                WE'RE NOT YOUR TYPICAL DESIGN AGENCY. WE'RE REBELS, MISFITS, AND DIGITAL REVOLUTIONARIES WHO BELIEVE THE
                WEB SHOULD BE BOLD, NOT BORING.
              </p>
            </div>
            <div className="relative">
              <div className="bg-yellow-400 border-4 border-white p-8 shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transform -rotate-2">
                <div className="text-6xl font-black mb-4">2019</div>
                <div className="font-bold uppercase">FOUNDED WITH A MISSION TO KILL BORING DESIGN</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-yellow-400 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-5xl font-black uppercase text-center mb-16">BY THE NUMBERS</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: "500+", label: "HAPPY CLIENTS" },
              { icon: Award, number: "50+", label: "DESIGN AWARDS" },
              { icon: Coffee, number: "10K+", label: "CUPS OF COFFEE" },
              { icon: Zap, number: "1M+", label: "LINES OF CODE" },
            ].map((stat, index) => (
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

      {/* Team Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-5xl font-black uppercase text-center mb-16">
            MEET THE <span className="text-pink-500">BRUTAL</span> TEAM
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="relative">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className={`absolute bottom-4 left-4 ${member.color} border-2 border-black px-3 py-1`}>
                    <span className="font-black uppercase text-xs">{member.role}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black uppercase mb-3">{member.name}</h3>
                  <p className="font-bold text-sm">{member.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-black text-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-5xl font-black uppercase text-center mb-16">
            OUR <span className="text-cyan-400">VALUES</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "BOLD OVER BORING",
                description: "WE BELIEVE DESIGN SHOULD MAKE PEOPLE STOP AND STARE, NOT SCROLL PAST.",
                color: "bg-yellow-400",
              },
              {
                title: "RESULTS OVER PRETTY",
                description: "BEAUTIFUL DESIGN MEANS NOTHING IF IT DOESN'T CONVERT. WE DESIGN FOR IMPACT.",
                color: "bg-pink-500",
              },
              {
                title: "HONEST COMMUNICATION",
                description: "NO BS, NO FLUFF. WE TELL YOU EXACTLY WHAT YOU NEED TO HEAR.",
                color: "bg-cyan-400",
              },
              {
                title: "RELENTLESS IMPROVEMENT",
                description: "GOOD ENOUGH ISN'T GOOD ENOUGH. WE PUSH BOUNDARIES EVERY SINGLE DAY.",
                color: "bg-yellow-400",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className={`${value.color} border-4 border-white p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all`}
              >
                <h3 className="text-2xl font-black uppercase mb-4 text-black">{value.title}</h3>
                <p className="font-bold text-black">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-500 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-5xl font-black uppercase mb-8 text-white">
            READY TO JOIN
            <br />
            <span className="text-black">THE REVOLUTION?</span>
          </h2>
          <Link href="/contact">
            <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase text-xl px-12 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              WORK WITH US
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  )
}
