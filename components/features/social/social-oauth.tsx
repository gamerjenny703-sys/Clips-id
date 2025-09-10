"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Youtube,
  Instagram,
  Twitter,
  CheckCircle,
  AlertCircle,
  Unlink,
  ExternalLink,
  Shield,
} from "lucide-react";

interface SocialAccount {
  platform: string;
  icon: React.ComponentType<any>;
  connected: boolean;
  username?: string;
  followers?: number;
  verified?: boolean;
  lastSync?: string;
  color: string;
}

interface SocialOAuthProps {
  accounts?: SocialAccount[];
  onConnect?: (platform: string) => void;
  onDisconnect?: (platform: string) => void;
  showStats?: boolean;
}

export default function SocialOAuth({
  accounts = [
    {
      platform: "YouTube",
      icon: Youtube,
      connected: true,
      username: "@yourhandle",
      followers: 12500,
      verified: true,
      lastSync: "2 hours ago",
      color: "bg-red-500",
    },
    {
      platform: "TikTok",
      icon: Instagram,
      connected: true,
      username: "@yourhandle",
      followers: 8900,
      verified: false,
      lastSync: "5 minutes ago",
      color: "bg-black",
    },
    {
      platform: "Twitter",
      icon: Twitter,
      connected: false,
      color: "bg-blue-500",
    },
    {
      platform: "Instagram",
      icon: Instagram,
      connected: false,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
  ],
  onConnect,
  onDisconnect,
  showStats = true,
}: SocialOAuthProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const handleConnect = async (platform: string) => {
    setConnecting(platform);
    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onConnect?.(platform);
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platform: string) => {
    setDisconnecting(platform);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onDisconnect?.(platform);
    } catch (error) {
      console.error("Disconnection failed:", error);
    } finally {
      setDisconnecting(null);
    }
  };

  const connectedAccounts = accounts.filter((account) => account.connected);
  const totalFollowers = connectedAccounts.reduce(
    (sum, account) => sum + (account.followers || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {showStats && connectedAccounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {connectedAccounts.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Connected Accounts
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {totalFollowers.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total Followers</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {connectedAccounts.filter((a) => a.verified).length}
              </div>
              <p className="text-sm text-muted-foreground">Verified Accounts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Connection Status Alert */}
      {connectedAccounts.length === 0 && (
        <Alert className="border-2 border-accent bg-accent/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect at least one social media account to start participating in
            contests and submitting clips.
          </AlertDescription>
        </Alert>
      )}

      {/* Social Media Accounts */}
      <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Social Media Accounts
          </CardTitle>
          <CardDescription>
            Connect your social media accounts to submit clips and track
            performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.map((account, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${account.color} text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]`}
                >
                  <account.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{account.platform}</h3>
                    {account.connected && account.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  {account.connected ? (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {account.username}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {account.followers?.toLocaleString()} followers
                        </span>
                        <span>Last sync: {account.lastSync}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not connected
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {account.connected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 bg-transparent"
                      onClick={() =>
                        window.open(
                          `https://${account.platform.toLowerCase()}.com`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDisconnect(account.platform)}
                      disabled={disconnecting === account.platform}
                    >
                      {disconnecting === account.platform ? (
                        "Disconnecting..."
                      ) : (
                        <>
                          <Unlink className="mr-1 h-3 w-3" />
                          Disconnect
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                    onClick={() => handleConnect(account.platform)}
                    disabled={connecting === account.platform}
                  >
                    {connecting === account.platform ? (
                      "Connecting..."
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* OAuth Information */}
      <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
        <CardHeader>
          <CardTitle className="text-lg font-bold">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Secure Connection</p>
              <p className="text-sm text-muted-foreground">
                We use OAuth 2.0 to securely connect your accounts without
                storing passwords
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium">Content Access</p>
              <p className="text-sm text-muted-foreground">
                We only access public content and basic profile information
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium">Performance Tracking</p>
              <p className="text-sm text-muted-foreground">
                Track your clip performance and contest participation
                automatically
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
