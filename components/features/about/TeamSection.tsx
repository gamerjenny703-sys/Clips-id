import { Card } from "@/components/ui/card";

export default function TeamSection() {
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
  ];

  return (
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
                <div
                  className={`absolute bottom-4 left-4 ${member.color} border-2 border-black px-3 py-1`}
                >
                  <span className="font-black uppercase text-xs">
                    {member.role}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black uppercase mb-3">
                  {member.name}
                </h3>
                <p className="font-bold text-sm">{member.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
