import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, DollarSign, Trophy, Clock, Users, ArrowLeft, Star, Filter, Youtube, Instagram } from "lucide-react"

export default function JoinContest() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button className="bg-white text-black border-4 border-white hover:bg-pink-500 hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK
              </Button>
              <div>
                <h1 className="text-4xl font-black uppercase text-white">JOIN CONTESTS</h1>
                <p className="text-white font-bold">FIND THE PERFECT CONTEST FOR YOUR SKILLS</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Search and Filters */}
        <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
                <Input
                  placeholder="SEARCH CONTESTS BY TITLE, CREATOR, OR TAGS..."
                  className="pl-10 border-4 border-black bg-white font-bold uppercase placeholder:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-yellow-400 text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Filter className="mr-2 h-4 w-4" />
                  FILTER
                </Button>
                <Button className="bg-cyan-400 text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  SORT BY PRIZE
                </Button>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["ALL", "GAMING", "COMEDY", "EDUCATIONAL", "VIRAL", "MUSIC", "SPORTS"].map((tag, index) => (
                <Badge
                  key={index}
                  className={`border-2 border-black font-black uppercase cursor-pointer ${
                    tag === "ALL" ? "bg-pink-500 text-white" : "bg-white text-black hover:bg-pink-500 hover:text-white"
                  }`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Best Gaming Highlights",
              creator: "GameMaster Pro",
              prize: "$500",
              participants: 45,
              timeLeft: "3 days",
              difficulty: "Medium",
              tags: ["Gaming", "Highlights", "Action"],
              requirements: "TikTok clips, 15-60 seconds",
              platform: "TikTok",
              icon: Instagram,
              color: "bg-pink-500",
              featured: true,
            },
            {
              title: "Funny Moments Compilation",
              creator: "ComedyKing",
              prize: "$300",
              participants: 28,
              timeLeft: "1 week",
              difficulty: "Easy",
              tags: ["Comedy", "Viral", "Entertainment"],
              requirements: "Any platform, 10-30 seconds",
              platform: "YouTube",
              icon: Youtube,
              color: "bg-yellow-400",
              featured: false,
            },
            {
              title: "Tutorial Clips Challenge",
              creator: "EduContent",
              prize: "$200",
              participants: 67,
              timeLeft: "2 days",
              difficulty: "Hard",
              tags: ["Educational", "Tutorial", "How-to"],
              requirements: "YouTube clips, must include captions",
              platform: "YouTube",
              icon: Youtube,
              color: "bg-cyan-400",
              featured: false,
            },
            {
              title: "Viral Dance Challenge",
              creator: "DanceVibes",
              prize: "$400",
              participants: 89,
              timeLeft: "5 days",
              difficulty: "Easy",
              tags: ["Dance", "Viral", "TikTok"],
              requirements: "TikTok only, 15-30 seconds",
              platform: "TikTok",
              icon: Instagram,
              color: "bg-pink-500",
              featured: true,
            },
            {
              title: "Tech Review Shorts",
              creator: "TechGuru",
              prize: "$350",
              participants: 23,
              timeLeft: "1 week",
              difficulty: "Medium",
              tags: ["Tech", "Review", "Educational"],
              requirements: "YouTube Shorts, under 60 seconds",
              platform: "YouTube",
              icon: Youtube,
              color: "bg-yellow-400",
              featured: false,
            },
            {
              title: "Cooking Hacks",
              creator: "ChefMaster",
              prize: "$250",
              participants: 34,
              timeLeft: "4 days",
              difficulty: "Easy",
              tags: ["Cooking", "Lifestyle", "Tips"],
              requirements: "Any platform, show recipe",
              platform: "Instagram",
              icon: Instagram,
              color: "bg-cyan-400",
              featured: false,
            },
          ].map((contest, index) => (
            <Card
              key={index}
              className={`border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all ${contest.color} relative`}
            >
              {contest.featured && (
                <div className="absolute -top-2 -right-2 bg-black text-white px-3 py-1 border-2 border-white font-black text-xs uppercase">
                  <Star className="inline h-3 w-3 mr-1" />
                  FEATURED
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-black uppercase text-black">{contest.title}</CardTitle>
                    <CardDescription className="font-bold text-black">by {contest.creator}</CardDescription>
                  </div>
                  <contest.icon className="h-6 w-6 text-black" />
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {contest.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} className="text-xs bg-white text-black border border-black">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-black" />
                    <span className="font-black">{contest.prize}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-black" />
                    <span className="font-bold">{contest.timeLeft}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-black" />
                    <span className="font-bold">{contest.participants} joined</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-black" />
                    <Badge
                      className={`text-xs font-bold ${
                        contest.difficulty === "Hard"
                          ? "bg-black text-white"
                          : contest.difficulty === "Medium"
                            ? "bg-white text-black border border-black"
                            : "bg-white text-black border border-black"
                      }`}
                    >
                      {contest.difficulty}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-white border-2 border-black rounded">
                  <p className="text-xs font-bold text-black">{contest.requirements}</p>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    JOIN NOW
                  </Button>
                  <Button className="bg-white text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    DETAILS
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button className="bg-pink-500 text-white border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-8">
            LOAD MORE CONTESTS
          </Button>
        </div>
      </div>
    </div>
  )
}
