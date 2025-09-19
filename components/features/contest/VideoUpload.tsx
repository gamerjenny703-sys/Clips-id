"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Youtube, FileVideo, X, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface VideoUploadProps {
  onVideoChange: (data: {
    type: "file" | "youtube_link" | "none";
    filePath?: string;
    fileSize?: number;
    youtubeLink?: string;
  }) => void;
  className?: string;
}

export default function VideoUpload({
  onVideoChange,
  className,
}: VideoUploadProps) {
  const [uploadType, setUploadType] = useState<
    "file" | "youtube_link" | "none"
  >("none");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
  const ALLOWED_TYPES = [
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/wmv",
    "video/flv",
    "video/webm",
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File size exceeds 100MB limit. Please upload to YouTube and provide the link instead.`,
      );
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        "Please select a valid video file (MP4, AVI, MOV, WMV, FLV, or WebM).",
      );
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
    setUploadType("file");
    onVideoChange({
      type: "file",
      filePath: "",
      fileSize: file.size,
    });
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const supabase = createClient();

      // Get user to ensure authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to upload videos.");
      }

      // Create unique filename
      const timestamp = Date.now();
      const fileExtension = selectedFile.name.split(".").pop();
      const fileName = `contest-videos/${user.id}/${timestamp}.${fileExtension}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("contest-videos")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("contest-videos").getPublicUrl(fileName);

      setUploadProgress(100);

      // Update parent component
      onVideoChange({
        type: "file",
        filePath: publicUrl,
        fileSize: selectedFile.size,
      });

      setError(null);
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleYoutubeLinkChange = (link: string) => {
    setYoutubeLink(link);
    setUploadType("youtube_link");
    onVideoChange({
      type: "youtube_link",
      youtubeLink: link,
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadType("none");
    onVideoChange({ type: "none" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeYoutubeLink = () => {
    setYoutubeLink("");
    setUploadType("none");
    onVideoChange({ type: "none" });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card
      className={`border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white ${className}`}
    >
      <CardHeader className="text-black bg-blue-400">
        <CardTitle className="text-3xl font-black uppercase flex items-center gap-3 relative z-10">
          Contest Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {error && (
          <Alert variant="destructive" className="border-4 border-black">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-bold">{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Type Selection */}
        <div className="space-y-4">
          <Label className="font-black uppercase">Choose Upload Method</Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Option */}
            <Button
              type="button"
              variant={uploadType === "file" ? "default" : "outline"}
              onClick={() => {
                setUploadType("file");
                setError(null);
                if (fileInputRef.current) fileInputRef.current.click();
              }}
              className={`border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                uploadType === "file"
                  ? "bg-yellow-400 text-white hover:bg-yellow-300"
                  : "bg-white text-black hover:bg-blue-400"
              }`}
            >
              <FileVideo className="mr-2 h-4 w-4" />
              Upload Video File
            </Button>

            {/* YouTube Link Option */}
            <Button
              type="button"
              variant={uploadType === "youtube_link" ? "default" : "outline"}
              onClick={() => {
                setUploadType("youtube_link");
                setError(null);
                setSelectedFile(null);
              }}
              className={`border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                uploadType === "youtube_link"
                  ? "bg-red-500 text-white hover:bg-red-400"
                  : "bg-white text-black hover:bg-red-400"
              }`}
            >
              <Youtube className="mr-2 h-4 w-4" />
              YouTube Link
            </Button>
          </div>
        </div>

        {/* File Upload Section */}
        {uploadType === "file" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-black uppercase text-black">
                Select Video File (Max 100MB)
              </Label>
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="border-4 border-black bg-white text-black placeholder:text-gray-500 font-bold h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:border-cyan-400 transition-all duration-200 pl-4"
              />
              <p className="text-xs text-muted-foreground font-bold">
                Supported formats: MP4, AVI, MOV, WMV, FLV, WebM
              </p>
            </div>

            {selectedFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-4 border-black bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <FileVideo className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-bold text-black">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  type="button"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                  className="w-full bg-blue-500 text-white hover:bg-blue-400 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
                >
                  {isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-pulse" />
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </>
                  )}
                </Button>

                {isUploading && (
                  <div className="w-full bg-gray-200 border-4 border-black">
                    <div
                      className="bg-blue-500 h-2 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* YouTube Link Section */}
        {uploadType === "youtube_link" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="youtube-link"
                className="font-black uppercase text-black"
              >
                YouTube Video Link
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="youtube-link"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeLink}
                  onChange={(e) => handleYoutubeLinkChange(e.target.value)}
                  className="border-4 border-black bg-white text-black placeholder:text-gray-500 font-bold h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:border-cyan-400 transition-all duration-200 pl-4"
                />
              </div>
              <p className="text-xs text-muted-foreground font-bold">
                Paste the full YouTube URL of your contest video
              </p>
            </div>

            {youtubeLink && (
              <div className="p-4 border-4 border-black bg-red-50">
                <div className="flex items-center space-x-3">
                  <Youtube className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="font-bold text-black">YouTube Link Added</p>
                    <p className="text-sm text-muted-foreground break-all">
                      {youtubeLink}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Alert */}
        <Alert className="border-4 border-black bg-blue-500 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-bold">
            <strong>File Size Limit:</strong> Videos larger than 100MB should be
            uploaded to YouTube first, then provide the link here.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
