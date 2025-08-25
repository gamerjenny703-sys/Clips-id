"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Settings,
  Shield,
  Bell,
  Trash2,
  Edit3,
  Check,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type SocialAccount = {
  platform: string;
  username?: string | null;
  connected: boolean;
};
export default function UserSettings() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
  });
  // State baru untuk loading saat menyimpan
  const [isSaving, setIsSaving] = useState(false);
  // State untuk data akun sosial yang akan ditampilkan
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);

  // Master list semua platform yang didukung
  const availablePlatforms = ["YouTube", "TikTok", "Twitter", "Instagram"];

  const fetchConnections = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    const { data: connections, error } = await supabase
      .from("social_connections")
      .select("platform, username")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching connections:", error);
      setLoading(false);
      return;
    }

    // Gabungkan master list dengan data koneksi yang ada
    const newSocialAccounts = availablePlatforms.map((platformName) => {
      const existingConnection = connections.find(
        (c) => c.platform.toLowerCase() === platformName.toLowerCase(),
      );
      return {
        platform: platformName,
        connected: !!existingConnection,
        username: existingConnection?.username,
      };
    });

    setSocialAccounts(newSocialAccounts);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/sign-in");
        return;
      }

      // --- TAMBAHAN: Ambil data dari tabel 'profiles' ---
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, phone_number")
        .eq("id", user.id)
        .single();
      // ---------------------------------------------

      // Isi state userInfo dengan data asli
      setUserInfo({
        name: profileData?.full_name || "Nama Belum Diatur",
        email: user.email || "",
        phone: profileData?.phone_number || "No. Telepon Belum Diatur",
        joinDate: user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "N/A",
      });

      // --- Logika untuk fetchConnections tetap sama ---
      const { data: connectionData } = await supabase
        .from("social_connections")
        .select("platform, username")
        .eq("user_id", user.id);

      const availablePlatforms = ["YouTube", "TikTok", "Twitter", "Instagram"];
      const newSocialAccounts = availablePlatforms.map((platformName) => {
        const existingConnection = connectionData?.find(
          (c) => c.platform.toLowerCase() === platformName.toLowerCase(),
        );
        return {
          platform: platformName,
          connected: !!existingConnection,
          username: existingConnection?.username,
        };
      });
      setSocialAccounts(newSocialAccounts);
      // ---------------------------------------------

      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleConnect = async (platform: string) => {
    setLoadingPlatform(platform);
    try {
      // Panggil API endpoint kita untuk mendapatkan URL otorisasi
      const response = await fetch(`/api/auth/${platform.toLowerCase()}`, {
        method: "POST",
        // Body bisa ditambahkan jika perlu mengirim user_id, tapi untuk GET URL tidak perlu
      });

      if (!response.ok) {
        throw new Error(`Failed to get auth URL for ${platform}`);
      }

      const { authUrl } = await response.json();

      if (authUrl) {
        // Arahkan pengguna ke halaman otorisasi platform
        window.location.href = authUrl;
      } else {
        throw new Error(`No authUrl received for ${platform}`);
      }
    } catch (err) {
      console.error(`Connection to ${platform} failed`, err);
      // Di sini bisa ditambahkan notifikasi error jika perlu
      setLoadingPlatform(null);
    }
    // Tidak perlu finally karena halaman akan redirect
  };

  const handleDisconnect = async (platform: string) => {
    setLoadingPlatform(platform);
    try {
      // Panggil API endpoint disconnect yang baru kita buat
      const response = await fetch(`/api/auth/disconnect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platform }),
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect");
      }

      console.log(`${platform} disconnected successfully`);

      // Penting: Panggil ulang fetchConnections untuk me-refresh UI
      // agar statusnya berubah dari "CONNECTED" menjadi "CONNECT"
      await fetchConnections();
    } catch (err) {
      console.error(`Disconnection from ${platform} failed`, err);
      // Di sini bisa ditambahkan notifikasi error jika perlu
    } finally {
      setLoadingPlatform(null);
    }
  };
  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: userInfo.name,
          phone_number: userInfo.phone,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        // Di sini Anda bisa menambahkan notifikasi error
      } else {
        console.log("Profile updated successfully!");
        setIsEditing(false); // Matikan mode edit jika berhasil
      }
    }
    setIsSaving(false);
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

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Information */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="bg-pink-500 border-b-4 border-black p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase text-white">
                PROFILE INFORMATION
              </h2>
              <Button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="bg-white text-black border-4 border-black hover:bg-yellow-400 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {isEditing ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    SAVE
                  </>
                ) : (
                  <>
                    <Edit3 className="mr-2 h-4 w-4" />
                    EDIT
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-black font-black uppercase mb-2">
                  <User className="inline mr-2 h-4 w-4" />
                  FULL NAME
                </label>
                {isEditing ? (
                  <Input
                    value={userInfo.name}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, name: e.target.value })
                    }
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                  />
                ) : (
                  <div className="bg-gray-100 border-4 border-black p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {userInfo.name}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-black font-black uppercase mb-2">
                  <Mail className="inline mr-2 h-4 w-4" />
                  EMAIL ADDRESS
                </label>
                {isEditing ? (
                  <Input
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                  />
                ) : (
                  <div className="bg-gray-100 border-4 border-black p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {userInfo.email}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-black font-black uppercase mb-2">
                  <Phone className="inline mr-2 h-4 w-4" />
                  PHONE NUMBER
                </label>
                {isEditing ? (
                  <Input
                    value={userInfo.phone}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, phone: e.target.value })
                    }
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                  />
                ) : (
                  <div className="bg-gray-100 border-4 border-black p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {userInfo.phone}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-black font-black uppercase mb-2">
                  <Calendar className="inline mr-2 h-4 w-4" />
                  MEMBER SINCE
                </label>
                <div className="bg-gray-100 border-4 border-black p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {userInfo.joinDate}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Connected Social Media Accounts */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="bg-cyan-400 border-b-4 border-black p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase text-black">
                CONNECTED ACCOUNTS
              </h2>
              {/* Tombol ini bisa dihapus jika semua manajemen ada di sini */}
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="font-bold text-center">Loading accounts...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialAccounts.map((account) => (
                  <div
                    key={account.platform}
                    className={`border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      account.connected ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black uppercase text-black">
                        {account.platform}
                      </h3>
                      {account.connected ? (
                        <Button
                          size="sm"
                          onClick={() => handleDisconnect(account.platform)}
                          disabled={!!loadingPlatform}
                          className="bg-red-500 text-white border-4 border-black hover:bg-red-600 font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          {loadingPlatform === account.platform
                            ? "..."
                            : "DISCONNECT"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(account.platform)}
                          disabled={!!loadingPlatform}
                          className="bg-black text-white border-4 border-black hover:bg-gray-700 font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          {loadingPlatform === account.platform
                            ? "..."
                            : "CONNECT"}
                        </Button>
                      )}
                    </div>
                    {account.connected && (
                      <div className="space-y-2">
                        <p className="font-bold text-black">
                          Username: {account.username}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Account Preferences */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="bg-pink-500 border-b-4 border-black p-4">
            <h2 className="text-2xl font-black uppercase text-white">
              ACCOUNT PREFERENCES
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50">
              <div>
                <h3 className="font-black uppercase text-black">
                  EMAIL NOTIFICATIONS
                </h3>
                <p className="text-black font-bold">
                  Receive updates about contests and earnings
                </p>
              </div>
              <Button className="bg-green-500 text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Bell className="mr-2 h-4 w-4" />
                ENABLED
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50">
              <div>
                <h3 className="font-black uppercase text-black">
                  TWO-FACTOR AUTHENTICATION
                </h3>
                <p className="text-black font-bold">
                  Add extra security to your account
                </p>
              </div>
              <Button className="bg-yellow-400 text-black border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Shield className="mr-2 h-4 w-4" />
                SETUP
              </Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="bg-red-500 border-b-4 border-black p-4">
            <h2 className="text-2xl font-black uppercase text-white">
              DANGER ZONE
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-red-50">
              <div>
                <h3 className="font-black uppercase text-black">
                  DELETE ACCOUNT
                </h3>
                <p className="text-black font-bold">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button className="bg-red-500 text-white border-4 border-black hover:bg-white hover:text-red-500 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Trash2 className="mr-2 h-4 w-4" />
                DELETE
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
