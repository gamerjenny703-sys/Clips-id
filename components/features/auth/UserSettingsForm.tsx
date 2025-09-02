"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Bell,
  Trash2,
  Edit3,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
};

type SocialAccount = {
  platform: string;
  username?: string | null;
  connected: boolean;
};

type UserSettingsFormProps = {
  initialProfile: ProfileData;
  initialSocialAccounts: SocialAccount[];
};

export default function UserSettingsForm({
  initialProfile,
  initialSocialAccounts,
}: UserSettingsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(
    initialSocialAccounts,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);

  const handleConnect = async (platform: string) => {
    setLoadingPlatform(platform);
    try {
      const response = await fetch(`/api/auth/${platform.toLowerCase()}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to get auth URL for ${platform}`);
      }

      const { authUrl } = await response.json();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error(`No authUrl received for ${platform}`);
      }
    } catch (err) {
      console.error(`Connection to ${platform} failed`, err);
      setLoadingPlatform(null);
    }
  };

  const fetchConnections = async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: connections } = await supabase
      .from("social_connections")
      .select("platform, username")
      .eq("user_id", user.id);

    const availablePlatforms = ["YouTube", "TikTok", "Twitter", "Instagram"];
    const newSocialAccounts = availablePlatforms.map((platformName) => {
      const existingConnection = connections?.find(
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
    fetchConnections();
  }, []);

  const handleDisconnect = async (platform: string) => {
    setLoadingPlatform(platform);
    try {
      const response = await fetch(`/api/auth/disconnect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect");
      }

      console.log(`${platform} disconnected successfully`);
      await fetchConnections();
    } catch (err) {
      console.error(`Disconnection from ${platform} failed`, err);
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
          email: userInfo.email, // kalau tabel `profiles` memang punya kolom email
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
      } else {
        console.log("Profile updated successfully!");
        setIsEditing(false);
      }
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Information */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-white">
        <div className="bg-pink-500 border-b-4 border-black p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase text-white">
              PROFILE INFORMATION
            </h2>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={isSaving}
              className="bg-white text-black border-4 border-black hover:bg-yellow-400 font-black uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)]"
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
            {/* Name */}
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
                  className="border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-bold"
                />
              ) : (
                <div className="bg-gray-100 border-4 border-black p-3 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  {userInfo.name}
                </div>
              )}
            </div>

            {/* Email */}
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
                  className="border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-bold"
                />
              ) : (
                <div className="bg-gray-100 border-4 border-black p-3 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  {userInfo.email}
                </div>
              )}
            </div>

            {/* Phone */}
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
                  className="border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-bold"
                />
              ) : (
                <div className="bg-gray-100 border-4 border-black p-3 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  {userInfo.phone}
                </div>
              )}
            </div>

            {/* Join Date */}
            <div>
              <label className="block text-black font-black uppercase mb-2">
                <Calendar className="inline mr-2 h-4 w-4" />
                MEMBER SINCE
              </label>
              <div className="bg-gray-100 border-4 border-black p-3 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                {userInfo.joinDate}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Connected Accounts */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-white">
        <div className="bg-cyan-400 border-b-4 border-black p-4">
          <h2 className="text-2xl font-black uppercase text-black">
            CONNECTED ACCOUNTS
          </h2>
        </div>
        <div className="p-6">
          {loading ? (
            <p className="font-bold text-center">Loading accounts...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialAccounts.map((account) => {
                const isDisabled =
                  account.platform === "Twitter" ||
                  account.platform === "Instagram";

                return (
                  <div
                    key={account.platform}
                    className={`border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
                      account.connected ? "bg-green-100" : "bg-gray-100"
                    } ${isDisabled ? "opacity-60" : ""}`}
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
                          className="bg-red-500 text-white border-4 border-black hover:bg-red-600 font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        >
                          {loadingPlatform === account.platform
                            ? "..."
                            : "DISCONNECT"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(account.platform)}
                          disabled={!!loadingPlatform || isDisabled}
                          className="bg-black text-white border-4 border-black hover:bg-gray-700 font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {loadingPlatform === account.platform
                            ? "..."
                            : isDisabled
                              ? "COMING SOON"
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
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <Card className="border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-white">
        <div className="bg-red-500 border-b-4 border-black p-4">
          <h2 className="text-2xl font-black uppercase text-white">
            DANGER ZONE
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-red-50">
            <div>
              <h3 className="font-black uppercase text-black">
                DELETE ACCOUNT
              </h3>
              <p className="text-black font-bold">
                Permanently delete your account and all data
              </p>
            </div>
            <Button className="bg-red-500 text-white border-4 border-black hover:bg-white hover:text-red-500 font-black uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <Trash2 className="mr-2 h-4 w-4" />
              DELETE
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
