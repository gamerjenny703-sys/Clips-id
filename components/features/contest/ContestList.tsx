// components/features/contest/ContestList.tsx

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Calendar, Search } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Contest } from "@/lib/constant.ts";

export default function ContestList() {
  const [allProjects, setAllProjects] = useState<Contest[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Contest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      const supabase = createClient();
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
        setIsLoading(false);
        return;
      }

      const projectsData: Contest[] =
        contests?.map((contest) => ({
          id: contest.id,
          title: contest.title,
          created_at: new Date(contest.created_at).getFullYear().toString(),
          description: contest.description,
          creatorName:
            contest.profiles?.full_name ||
            contest.profiles?.username ||
            "Anonymous",
          image: "/placeholder.svg?height=400&width=600",
          tags: contest.requirements?.tags || [],
        })) || [];

      setAllProjects(projectsData);
      setFilteredProjects(projectsData);
      setIsLoading(false);
    };

    fetchContests();
  }, []);

  // Menjalankan logika filter setiap kali searchTerm berubah
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProjects(allProjects);
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = allProjects.filter(
      (project) =>
        project.title.toLowerCase().includes(lowercasedTerm) ||
        project.description.toLowerCase().includes(lowercasedTerm) ||
        project.tags.some((tag) => tag.toLowerCase().includes(lowercasedTerm)),
    );
    setFilteredProjects(filtered);
  }, [searchTerm, allProjects]);

  return (
    <>
      {/* Bagian Search dan Filter */}
      <section className="bg-yellow-400 py-8 sticky top-[73px] z-40 border-b-4 border-black">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
            <Input
              type="text"
              placeholder="Search by title, description, or #tag..."
              className="pl-12 border-4 border-black bg-white text-black font-bold h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          {isLoading ? (
            <div className="text-center py-20">
              <h3 className="text-4xl font-black uppercase mb-4">LOADING...</h3>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-4xl font-black uppercase mb-4">
                NO CONTESTS FOUND
              </h3>
              <p className="text-lg font-bold text-gray-600">
                Try a different search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden group hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  {/* ... Konten Card tetap sama ... */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-bold text-sm">{project.year}</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-3">
                      {project.title}
                    </h3>
                    <p className="font-bold mb-4 text-sm h-16 overflow-hidden">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4 h-8 overflow-hidden">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-200 border-2 border-black px-2 py-1 text-xs font-bold uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
    </>
  );
}
