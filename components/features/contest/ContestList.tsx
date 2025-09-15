// components/features/contest/ContestList.tsx

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Calendar, Search, Users, Trophy } from "lucide-react";
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
      const { data: contests, error } = await supabase
        .from("contests")
        .select(
          `
          id,
          title,
          description,
          created_at,
          requirements,
          thumbnail_url,
          profiles!contests_creator_id_fkey (
            username,
            full_name
          )
        `,
        )
        .eq("status", "active");

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
          thumbnail_url:
            contest.thumbnail_url || "/placeholder.svg?height=400&width=600",
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
      <section className="bg-yellow-400 py-12 border-b-4 border-black">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-black" />
            <Input
              type="text"
              placeholder="Search contests by title, description, or tags..."
              className="pl-14 border-4 border-black bg-white text-black font-bold h-16 text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-yellow-400 mb-6"></div>
              <h3 className="text-4xl font-black uppercase mb-4">
                LOADING CONTESTS...
              </h3>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-4xl font-black uppercase mb-4">
                NO CONTESTS FOUND
              </h3>
              <p className="text-lg font-bold text-gray-600">
                Try a different search term or browse all contests.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden group hover:translate-x-1 hover:translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 bg-white"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={project.thumbnail_url || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-yellow-400 border-2 border-black px-3 py-1 font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {project.prize}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-bold text-sm">
                            {project.created_at}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{project.participants}</span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-black uppercase mb-3 leading-tight">
                        {project.title}
                      </h3>

                      <p className="font-medium mb-4 text-sm leading-relaxed text-gray-700 line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-gray-100 border-2 border-black px-3 py-1 text-xs font-bold uppercase hover:bg-yellow-400 transition-colors cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs font-bold text-gray-500 px-2 py-1">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-gray-600 mb-4">
                        Created by {project.creatorName}
                      </div>

                      <Link href={`/work/${project.id}`}>
                        <Button className="w-full bg-black text-white border-4 border-black hover:bg-yellow-400 hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all h-12">
                          <Trophy className="mr-2 h-4 w-4" />
                          JOIN CONTEST
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
