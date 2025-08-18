"use client";

import { useState } from "react";
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

export default function UserSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "January 2024",
  });

  // Mock connected accounts data
  const connectedAccounts = [
    {
      platform: "YouTube",
      username: "@johndoe",
      connected: true,
      followers: "12.5K",
    },
    {
      platform: "TikTok",
      username: "@johndoe_clips",
      connected: true,
      followers: "8.2K",
    },
    {
      platform: "Twitter",
      username: "@johndoe",
      connected: false,
      followers: "0",
    },
    {
      platform: "Instagram",
      username: "@johndoe",
      connected: true,
      followers: "15.3K",
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
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
              <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                MANAGE CONNECTIONS
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedAccounts.map((account, index) => (
                <div
                  key={index}
                  className={`border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    account.connected ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black uppercase text-black">
                      {account.platform}
                    </h3>
                    <Badge
                      className={`border-2 border-black font-black uppercase ${
                        account.connected
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {account.connected ? "CONNECTED" : "NOT CONNECTED"}
                    </Badge>
                  </div>
                  {account.connected && (
                    <div className="space-y-2">
                      <p className="font-bold text-black">
                        Username: {account.username}
                      </p>
                      <p className="font-bold text-black">
                        Followers: {account.followers}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
