"use client";

import { useState } from "react";
import Layout from "../../../components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock project data - in real app, this would come from API/database
  const project = {
    title: "CRYPTO EXCHANGE",
    category: "WEB DESIGN",
    year: "2024",
    client: "CRYPTOBEAST TRADING",
    duration: "6 MONTHS",
    team: "8 PEOPLE",
    description:
      "BOLD TRADING PLATFORM THAT MAKES CRYPTO ACCESSIBLE TO EVERYONE",
    challenge:
      "CREATE A TRADING PLATFORM THAT BEGINNERS CAN USE WITHOUT FEELING OVERWHELMED, WHILE STILL PROVIDING ADVANCED FEATURES FOR PRO TRADERS.",
    solution:
      "WE DESIGNED A DUAL-INTERFACE SYSTEM WITH A SIMPLIFIED VIEW FOR BEGINNERS AND AN ADVANCED MODE FOR EXPERIENCED TRADERS. THE BRUTAL DESIGN LANGUAGE MAKES EVERY ACTION CLEAR AND CONFIDENT.",
    results: [
      { metric: "USER GROWTH", value: "300%" },
      { metric: "TRADING VOLUME", value: "$50M+" },
      { metric: "USER RETENTION", value: "85%" },
      { metric: "MOBILE USAGE", value: "70%" },
    ],
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    technologies: [
      "REACT",
      "TYPESCRIPT",
      "NEXT.JS",
      "TAILWIND",
      "WEBSOCKETS",
      "REDIS",
    ],
    features: [
      "REAL-TIME TRADING",
      "PORTFOLIO TRACKING",
      "MOBILE-FIRST DESIGN",
      "ADVANCED CHARTING",
      "SOCIAL TRADING",
      "SECURITY FEATURES",
    ],
    color: "bg-yellow-400",
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + project.images.length) % project.images.length,
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Link href="/work">
            <Button className="mb-8 bg-white text-black border-4 border-white hover:bg-yellow-400 hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              BACK TO WORK
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className={`inline-block ${project.color} border-4 border-white px-4 py-2 mb-6`}
              >
                <span className="font-black uppercase text-black">
                  {project.category}
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase mb-6">
                {project.title}
              </h1>
              <p className="text-xl font-bold mb-8">{project.description}</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-black uppercase text-yellow-400 mb-2">
                    CLIENT
                  </h3>
                  <p className="font-bold">{project.client}</p>
                </div>
                <div>
                  <h3 className="font-black uppercase text-yellow-400 mb-2">
                    YEAR
                  </h3>
                  <p className="font-bold">{project.year}</p>
                </div>
                <div>
                  <h3 className="font-black uppercase text-yellow-400 mb-2">
                    DURATION
                  </h3>
                  <p className="font-bold">{project.duration}</p>
                </div>
                <div>
                  <h3 className="font-black uppercase text-yellow-400 mb-2">
                    TEAM
                  </h3>
                  <p className="font-bold">{project.team}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={project.images[currentImageIndex] || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-96 object-cover border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
              />
              <Button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black border-4 border-black hover:bg-white font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black border-4 border-black hover:bg-white font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {project.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 border-2 border-white ${
                      index === currentImageIndex
                        ? "bg-yellow-400"
                        : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-yellow-400 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-5xl font-black uppercase text-center mb-12">
            BRUTAL <span className="text-white">RESULTS</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {project.results.map((result, index) => (
              <Card
                key={index}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center"
              >
                <div className="text-4xl font-black uppercase mb-2">
                  {result.value}
                </div>
                <div className="font-bold uppercase text-sm">
                  {result.metric}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="bg-pink-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
              <h3 className="text-3xl font-black uppercase mb-6 text-white">
                THE CHALLENGE
              </h3>
              <p className="font-bold text-lg text-white">
                {project.challenge}
              </p>
            </Card>

            <Card className="bg-cyan-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
              <h3 className="text-3xl font-black uppercase mb-6">
                THE SOLUTION
              </h3>
              <p className="font-bold text-lg">{project.solution}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Technologies & Features */}
      <section className="bg-black py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-black uppercase mb-8 text-yellow-400">
                TECHNOLOGIES
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-white border-4 border-white px-4 py-2 font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-black uppercase mb-8 text-pink-500">
                KEY FEATURES
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white border-4 border-white px-4 py-3 font-bold uppercase text-black text-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-5xl font-black uppercase text-center mb-12">
            PROJECT <span className="text-pink-500">GALLERY</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {project.images.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`${project.title} screenshot ${index + 1}`}
                className="w-full h-64 object-cover border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-500 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-5xl font-black uppercase mb-8 text-white">
            WANT RESULTS
            <br />
            <span className="text-black">LIKE THIS?</span>
          </h2>
          <p className="text-xl font-bold text-white mb-8 max-w-2xl mx-auto">
            LET'S CREATE SOMETHING BRUTAL TOGETHER. YOUR PROJECT DESERVES THE
            SAME DOMINATING RESULTS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase text-xl px-8 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                START YOUR PROJECT
              </Button>
            </Link>
            <Link href="/work">
              <Button className="bg-white text-black border-4 border-black hover:bg-yellow-400 hover:text-black font-black uppercase text-xl px-8 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                VIEW MORE WORK
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
