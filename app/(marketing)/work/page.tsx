import Link from "next/link";
import { Button } from "@/components/ui/button";
import ContestList from "@/components/features/contest/ContestList";

// Komponen ini sekarang adalah Server Component, tidak perlu "use client"
export default async function WorkPage() {
  return (
    <>
      {/* Projects Grid */}
      <ContestList />
    </>
  );
}
