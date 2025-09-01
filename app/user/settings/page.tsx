import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import UserSettingsForm from "@/components/features/auth/UserSettingsForm";

export default async function UserSettings() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name, phone_number")
    .eq("id", user.id)
    .single();
  const { data: connections } = await supabase
    .from("social_connections")
    .select("platform, username")
    .eq("user_id", user.id)
    .single();

  const availablePlatforms = ["Youtube", "TikTok", "Twitter", "Instagram"];
  const socialAccounts = availablePlatforms.map((platformName) => {
    const existingConnection = connections?.find(
      (c) => c.platform.toLoweCase() === platformName.toLowerCase(),
    );
    return {
      platform: platformName,
      connected: !!existingConnection,
      username: existingConnection?.username,
    };
  });

  const profileInfo = {
    name: profileData?.full_name || "nama belum diatur",
    email: user.email || "",
    phone: profileData?.phone_number || "nomor telepon belum di atur",
    joinDate: user.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : "N/A",
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="bg-yellow-400 border-4 border-black p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black uppercase text-black mb-2">
              ACCOUNT SETTINGS
            </h1>
            <p className="text-black font-bold">
              Manage your profile and connected accounts
            </p>
          </div>
          <Settings className="h-12 w-12 text-black" />
        </div>
      </div>
      <UserSettingsForm
        initialProfile={profileInfo}
        initialSocialAccounts={socialAccounts}
      />
    </div>
  );
}
