// app/api/auth/disconnect/route.ts

import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Ambil nama platform dari body request
    const { platform } = await request.json();
    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 },
      );
    }

    const { error: deleteError } = await supabase
      .from("social_connections")
      .delete()
      .match({ user_id: user.id, platform: platform });

    if (deleteError) {
      throw deleteError;
    }

    // 4. Kirim respons sukses
    return NextResponse.json({
      message: `${platform} has been disconnected successfully.`,
    });
  } catch (error: any) {
    console.error("Disconnect Error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect account." },
      { status: 500 },
    );
  }
}
