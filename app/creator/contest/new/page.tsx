"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CalendarIcon, DollarSign, Info, Plus, X, Youtube, Instagram, Twitter } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function CreateContestPage() {
  const [contestData, setContestData] = useState({
    title: "",
    description: "",
    prize: "",
    duration: "7",
    durationType: "days",
    endDate: undefined as Date | undefined,
    platforms: [] as string[],
    requirements: "",
    tags: [] as string[],
    maxSubmissions: "unlimited",
    judging: "automatic",
    paymentType: "winner-takes-all",
    isPublic: true,
    allowMultipleWinners: false,
  })

  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const platforms = [
    { id: "youtube", name: "YouTube", icon: Youtube },
    { id: "tiktok", name: "TikTok", icon: Instagram },
    { id: "twitter", name: "Twitter", icon: Twitter },
    { id: "instagram", name: "Instagram", icon: Instagram },
  ]

  const addTag = () => {
    if (newTag.trim() && !contestData.tags.includes(newTag.trim())) {
      setContestData({
        ...contestData,
        tags: [...contestData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setContestData({
      ...contestData,
      tags: contestData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const togglePlatform = (platformId: string) => {
    const platforms = contestData.platforms.includes(platformId)
      ? contestData.platforms.filter((p) => p !== platformId)
      : [...contestData.platforms, platformId]
    setContestData({ ...contestData, platforms })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("[v0] Contest created:", contestData)
      // Redirect to contest management or dashboard
    } catch (error) {
      console.error("[v0] Failed to create contest:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-black bg-pink-500">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/creator/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-4 border-black bg-white hover:bg-yellow-400 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-white uppercase">Create New Contest</h1>
              <p className="text-pink-100 font-bold">Set up a content clipping contest for your audience</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="bg-yellow-400">
              <CardTitle className="text-xl font-black uppercase">Basic Information</CardTitle>
              <CardDescription className="font-bold text-black">
                Set up the core details of your contest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-black uppercase">
                  Contest Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Best Gaming Highlights Contest"
                  value={contestData.title}
                  onChange={(e) => setContestData({ ...contestData, title: e.target.value })}
                  className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-black uppercase">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what kind of clips you're looking for, any specific requirements, and what makes a winning submission..."
                  value={contestData.description}
                  onChange={(e) => setContestData({ ...contestData, description: e.target.value })}
                  className="border-4 border-black bg-white min-h-[120px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="prize" className="font-black uppercase">
                    Prize Amount *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
                    <Input
                      id="prize"
                      type="number"
                      placeholder="500"
                      value={contestData.prize}
                      onChange={(e) => setContestData({ ...contestData, prize: e.target.value })}
                      className="border-4 border-black bg-white pl-10 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-black uppercase">Payment Type</Label>
                  <Select
                    value={contestData.paymentType}
                    onValueChange={(value) => setContestData({ ...contestData, paymentType: value })}
                  >
                    <SelectTrigger className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-4 border-black bg-white">
                      <SelectItem value="winner-takes-all">Winner Takes All</SelectItem>
                      <SelectItem value="split-top-3">Split Between Top 3</SelectItem>
                      <SelectItem value="per-view">Pay Per View</SelectItem>
                      <SelectItem value="per-engagement">Pay Per Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Duration & Timing */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="bg-cyan-400">
              <CardTitle className="text-xl font-black uppercase">Duration & Timing</CardTitle>
              <CardDescription className="font-bold text-black">
                Set when your contest runs and how long it lasts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-black uppercase">Contest Duration</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="7"
                      value={contestData.duration}
                      onChange={(e) => setContestData({ ...contestData, duration: e.target.value })}
                      className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                    <Select
                      value={contestData.durationType}
                      onValueChange={(value) => setContestData({ ...contestData, durationType: value })}
                    >
                      <SelectTrigger className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-4 border-black bg-white">
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-black uppercase">End Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-4 border-black bg-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {contestData.endDate ? format(contestData.endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={contestData.endDate}
                        onSelect={(date) => setContestData({ ...contestData, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform & Requirements */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="bg-pink-500">
              <CardTitle className="text-xl font-black uppercase text-white">Platform & Requirements</CardTitle>
              <CardDescription className="font-bold text-pink-100">
                Specify where clips should be posted and any special requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label className="font-black uppercase">Allowed Platforms *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {platforms.map((platform) => (
                    <Button
                      key={platform.id}
                      type="button"
                      variant={contestData.platforms.includes(platform.id) ? "default" : "outline"}
                      className={`border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                        contestData.platforms.includes(platform.id)
                          ? "bg-yellow-400 text-black hover:bg-yellow-300"
                          : "bg-white text-black hover:bg-cyan-400"
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <platform.icon className="mr-2 h-4 w-4" />
                      {platform.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="font-black uppercase">
                  Specific Requirements
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="e.g., Clips must be 15-60 seconds, include captions, use specific hashtags..."
                  value={contestData.requirements}
                  onChange={(e) => setContestData({ ...contestData, requirements: e.target.value })}
                  className="border-4 border-black bg-white min-h-[120px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="space-y-3">
                <Label className="font-black uppercase">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="bg-accent text-accent-foreground font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {contestData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm font-black uppercase bg-pink-500 text-white"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contest Settings */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="bg-yellow-400">
              <CardTitle className="text-xl font-black uppercase">Contest Settings</CardTitle>
              <CardDescription className="font-bold text-black">Configure how your contest will work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-black uppercase">Max Submissions Per User</Label>
                  <Select
                    value={contestData.maxSubmissions}
                    onValueChange={(value) => setContestData({ ...contestData, maxSubmissions: value })}
                  >
                    <SelectTrigger className="border-4 border-black bg-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-4 border-black bg-white">
                      <SelectItem value="1">1 submission</SelectItem>
                      <SelectItem value="3">3 submissions</SelectItem>
                      <SelectItem value="5">5 submissions</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-black uppercase">Judging Method</Label>
                  <Select
                    value={contestData.judging}
                    onValueChange={(value) => setContestData({ ...contestData, judging: value })}
                  >
                    <SelectTrigger className="border-4 border-black bg-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-4 border-black bg-white">
                      <SelectItem value="automatic">Automatic (by metrics)</SelectItem>
                      <SelectItem value="manual">Manual review</SelectItem>
                      <SelectItem value="community">Community voting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-black uppercase">Public Contest</Label>
                    <p className="text-sm text-muted-foreground">Allow anyone to discover and join this contest</p>
                  </div>
                  <Switch
                    checked={contestData.isPublic}
                    onCheckedChange={(checked) => setContestData({ ...contestData, isPublic: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-black uppercase">Allow Multiple Winners</Label>
                    <p className="text-sm text-muted-foreground">Split prize between top performers</p>
                  </div>
                  <Switch
                    checked={contestData.allowMultipleWinners}
                    onCheckedChange={(checked) => setContestData({ ...contestData, allowMultipleWinners: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview & Submit */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="bg-cyan-400">
              <CardTitle className="text-xl font-black uppercase">Contest Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Alert className="border-4 border-black bg-pink-500 text-white">
                <Info className="h-4 w-4" />
                <AlertDescription className="font-bold">
                  Your contest will be live immediately after creation. Make sure all details are correct before
                  submitting.
                </AlertDescription>
              </Alert>

              <div className="mt-6 flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !contestData.title || !contestData.description || !contestData.prize}
                  className="bg-pink-500 text-white hover:bg-pink-400 font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
                >
                  {isSubmitting ? "Creating Contest..." : "Create Contest"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-4 border-black bg-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400"
                >
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
