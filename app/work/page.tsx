import Layout from "@/components/shared/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Calendar, Search } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Komponen ini sekarang adalah Server Component, tidak perlu "use client"
export default async function WorkPage() {
  const supabase = createClient();

  // Ambil data kontes, pastikan 'id' ikut terambil
  const { data: contests, error } = await supabase.from("contests").select(`
      id,
      title,
      description,
      created_at,
      requirements,
      profiles!contests_creator_id_fkey (
        username,
        full_name
      )
    `);

  if (error) {
    console.error("Error fetching contests:", error);
  }

  // Transformasi data untuk UI
  const projects =
    contests?.map((contest) => ({
      id: contest.id,
      title: contest.title,
      category: contest.requirements?.tags?.[0] || "GENERAL",
      year: new Date(contest.created_at).getFullYear().toString(),
      description: contest.description,
      // Akses nama creator dari relasi yang sudah benar
      creatorName:
        contest.profiles?.full_name ||
        contest.profiles?.username ||
        "Anonymous",
      image: "/placeholder.svg?height=400&width=600",
      color: "bg-yellow-400",
      tags: contest.requirements?.tags || [],
    })) || [];

  return (
    <Layout>
      <section className="bg-black text-white py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-black uppercase mb-8">
            MAKE <span className="text-yellow-400">CLIPPER</span> GOOD
          </h1>
          <p className="text-xl font-bold max-w-3xl mx-auto">
            PROJECTS THAT DON'T JUST LOOK GOOD - THEY DOMINATE THEIR MARKETS AND
            CRUSH THE COMPETITION.
          </p>
        </div>
      </section>

      {/* Bagian Search dan Filter dinonaktifkan sementara karena memerlukan state client-side.
        Kita akan implementasikan ini kembali dengan cara yang benar nanti.
      */}
      {/*
      <section className="bg-yellow-400 py-8">
        ... UI untuk search dan filter ...
      </section>
      */}

      {/* Projects Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-4xl font-black uppercase mb-4">
                NO CONTESTS FOUND
              </h3>
              <p className="text-lg font-bold text-gray-600">
                COME BACK LATER FOR MORE OPPORTUNITIES!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden group hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <div
                      className={`absolute top-4 left-4 ${project.color} border-2 border-black px-3 py-1`}
                    >
                      <span className="font-black uppercase text-xs">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-bold text-sm">{project.year}</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-3">
                      {project.title}
                    </h3>
                    <p className="font-bold mb-4 text-sm">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-200 border-2 border-black px-2 py-1 text-xs font-bold uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* PERBAIKAN DI SINI: Bungkus Button dengan Link */}
                    <Link href={`/work/${project.id}`}>
                      <Button className="w-full bg-black text-white border-4 border-black hover:bg-yellow-400 hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        VIEW PROJECT
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-500 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-5xl font-black uppercase mb-8 text-white">
            READY FOR YOUR
            <br />
            <span className="text-black">BRUTAL PROJECT?</span>
          </h2>

          <Link href="/contact">
            <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase text-xl px-12 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              START YOUR PROJECT
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
