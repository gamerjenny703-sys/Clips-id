"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function UnsaveButtonClient({
  action,
}: {
  action: () => Promise<void>;
}) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    try {
      await action();
      // revalidatePath akan menangani refresh, jadi tidak perlu state sukses di sini
    } catch (error) {
      console.error(error);
      // Anda bisa menambahkan notifikasi error di sini jika mau
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleClick}
      disabled={isPending}
      className="text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Unsave</span>
    </Button>
  );
}
