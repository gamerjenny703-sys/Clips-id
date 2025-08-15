import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  Link,
  Youtube,
  Instagram,
  Twitter,
  Clock,
  DollarSign,
  Trophy,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function SubmitClip() {
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
                <h1 className="text-4xl font-black uppercase text-white">SUBMIT CLIP</h1>
                <p className="text-white font-bold">UPLOAD YOUR CONTENT TO WIN CONTESTS</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase text-black">CLIP SUBMISSION</CardTitle>
                <CardDescription className="font-bold text-black">
                  Fill out the details below to submit your clip
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contest Selection */}
                <div>
                  <label className="block text-sm font-black uppercase text-black mb-2">SELECT CONTEST</label>
                  <Select>
                    <SelectTrigger className="border-4 border-black bg-cyan-400 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <SelectValue placeholder="CHOOSE A CONTEST" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gaming">Best Gaming Highlights - $500</SelectItem>
                      <SelectItem value="funny">Funny Moments Compilation - $300</SelectItem>
                      <SelectItem value="tutorial">Tutorial Clips Challenge - $200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-black uppercase text-black mb-2">SOCIAL MEDIA PLATFORM</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: "YouTube", icon: Youtube, color: "bg-pink-500" },
                      { name: "TikTok", icon: Instagram, color: "bg-yellow-400" },
                      { name: "Twitter", icon: Twitter, color: "bg-cyan-400" },
                    ].map((platform, index) => (
                      <Button
                        key={index}
                        className={`${platform.color} text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-16`}
                      >
                        <platform.icon className="mr-2 h-5 w-5" />
                        {platform.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Clip URL */}
                <div>
                  <label className="block text-sm font-black uppercase text-black mb-2">CLIP URL</label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
                    <Input
                      placeholder="PASTE YOUR CLIP URL HERE..."
                      className="pl-10 border-4 border-black bg-white font-bold placeholder:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-black uppercase text-black mb-2">CLIP TITLE</label>
                  <Input
                    placeholder="ENTER A CATCHY TITLE..."
                    className="border-4 border-black bg-white font-bold placeholder:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-black uppercase text-black mb-2">DESCRIPTION</label>
                  <Textarea
                    placeholder="DESCRIBE YOUR CLIP AND WHY IT SHOULD WIN..."
                    className="border-4 border-black bg-white font-bold placeholder:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[100px]"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-black uppercase text-black mb-2">TAGS</label>
                  <Input
                    placeholder="GAMING, FUNNY, VIRAL, ETC..."
                    className="border-4 border-black bg-white font-bold placeholder:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                {/* Submit Button */}
                <Button className="w-full bg-pink-500 text-white border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-16 text-lg">
                  <Upload className="mr-2 h-5 w-5" />
                  SUBMIT CLIP
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contest Info */}
            <Card className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-black">CONTEST INFO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Prize Pool</span>
                  <span className="font-black text-black flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    $500
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Time Left</span>
                  <span className="font-black text-black flex items-center">
                    <Clock className="h-4 w-4 mr-1" />3 days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Participants</span>
                  <span className="font-black text-black flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    45
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="border-4 border-black bg-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-black">REQUIREMENTS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-black mt-0.5" />
                  <span className="text-sm font-bold">15-60 seconds duration</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-black mt-0.5" />
                  <span className="text-sm font-bold">Gaming content only</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-black mt-0.5" />
                  <span className="text-sm font-bold">Original content</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-black mt-0.5" />
                  <span className="text-sm font-bold">Must be public</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-4 border-black bg-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-white">WINNING TIPS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-bold text-white">• Use trending hashtags</p>
                <p className="text-sm font-bold text-white">• Post at peak hours</p>
                <p className="text-sm font-bold text-white">• Engage with comments</p>
                <p className="text-sm font-bold text-white">• High-quality footage</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
