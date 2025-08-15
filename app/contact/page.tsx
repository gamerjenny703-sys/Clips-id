import Layout from "../../components/layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-black uppercase mb-8">
            LET'S MAKE
            <br />
            <span className="text-yellow-400">BRUTAL</span> MAGIC
          </h1>
          <p className="text-xl font-bold max-w-3xl mx-auto">
            READY TO TRANSFORM YOUR DIGITAL PRESENCE? LET'S TALK ABOUT YOUR PROJECT AND MAKE SOMETHING EXTRAORDINARY.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
              <h2 className="text-3xl font-black uppercase mb-8">START YOUR PROJECT</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2">FIRST NAME *</label>
                    <Input
                      required
                      className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                      placeholder="JOHN"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2">LAST NAME *</label>
                    <Input
                      required
                      className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                      placeholder="DOE"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2">EMAIL *</label>
                  <Input
                    type="email"
                    required
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                    placeholder="JOHN@COMPANY.COM"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2">COMPANY</label>
                  <Input
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                    placeholder="YOUR COMPANY"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2">PROJECT TYPE *</label>
                  <select className="w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold p-3 bg-white">
                    <option>WEB DESIGN</option>
                    <option>DEVELOPMENT</option>
                    <option>BRANDING</option>
                    <option>CONSULTING</option>
                    <option>ALL OF THE ABOVE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2">BUDGET RANGE *</label>
                  <select className="w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold p-3 bg-white">
                    <option>$10K - $25K</option>
                    <option>$25K - $50K</option>
                    <option>$50K - $100K</option>
                    <option>$100K+</option>
                    <option>LET'S DISCUSS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2">PROJECT DETAILS *</label>
                  <Textarea
                    required
                    rows={6}
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold resize-none"
                    placeholder="TELL US ABOUT YOUR BRUTAL PROJECT..."
                  />
                </div>
                <Button className="w-full bg-pink-500 text-white border-4 border-black hover:bg-black font-black uppercase text-lg py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  SEND MESSAGE
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                <h3 className="text-2xl font-black uppercase mb-6">GET IN TOUCH</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Mail className="h-6 w-6" />
                    <div>
                      <div className="font-bold uppercase text-sm">EMAIL</div>
                      <div className="font-black">HELLO@BRUTAL.CO</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6" />
                    <div>
                      <div className="font-bold uppercase text-sm">PHONE</div>
                      <div className="font-black">+1 (555) BRUTAL-1</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="h-6 w-6" />
                    <div>
                      <div className="font-bold uppercase text-sm">LOCATION</div>
                      <div className="font-black">NEW YORK, NY</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6" />
                    <div>
                      <div className="font-bold uppercase text-sm">HOURS</div>
                      <div className="font-black">24/7 BRUTAL SUPPORT</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-pink-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-white">
                <h3 className="text-2xl font-black uppercase mb-4">RESPONSE TIME</h3>
                <div className="text-4xl font-black mb-2">&lt; 24 HRS</div>
                <p className="font-bold">
                  WE DON'T BELIEVE IN KEEPING CLIENTS WAITING. EXPECT A BRUTAL RESPONSE WITHIN 24 HOURS.
                </p>
              </Card>

              <Card className="bg-cyan-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                <h3 className="text-2xl font-black uppercase mb-4">FREE CONSULTATION</h3>
                <p className="font-bold mb-4">
                  NOT SURE WHERE TO START? BOOK A FREE 30-MINUTE CONSULTATION AND WE'LL HELP YOU PLAN YOUR BRUTAL
                  TRANSFORMATION.
                </p>
                <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  BOOK NOW
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-black text-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-5xl font-black uppercase text-center mb-16">
            BRUTAL <span className="text-yellow-400">FAQ</span>
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "HOW LONG DOES A PROJECT TAKE?",
                answer:
                  "DEPENDS ON THE SCOPE. SIMPLE SITES: 2-4 WEEKS. COMPLEX PROJECTS: 8-12 WEEKS. WE MOVE FAST WITHOUT CUTTING CORNERS.",
              },
              {
                question: "DO YOU WORK WITH SMALL BUSINESSES?",
                answer:
                  "ABSOLUTELY. WE BELIEVE EVERY BUSINESS DESERVES BRUTAL DESIGN, REGARDLESS OF SIZE. OUR MINIMUM PROJECT IS $10K.",
              },
              {
                question: "WHAT IF I DON'T LIKE THE DESIGN?",
                answer:
                  "WE OFFER UNLIMITED REVISIONS UNTIL YOU'RE 100% SATISFIED. OUR GOAL IS TO MAKE YOU LOVE YOUR BRUTAL WEBSITE.",
              },
              {
                question: "DO YOU PROVIDE ONGOING SUPPORT?",
                answer: "YES. WE OFFER MAINTENANCE PACKAGES AND 24/7 SUPPORT. YOUR SUCCESS IS OUR SUCCESS.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="bg-white text-black border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6"
              >
                <h3 className="text-xl font-black uppercase mb-3">{faq.question}</h3>
                <p className="font-bold">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
