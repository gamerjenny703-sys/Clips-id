// components/features/contest/ThumbnailUpload.tsx

"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface ThumbnailUploadProps {
  onUploadComplete: (filePath: string) => void;
  onUploadStart: () => void;
  onUploadError: () => void;
  className?: string;
}

export default function ThumbnailUpload({
  onUploadComplete,
  onUploadStart,
  onUploadError,
  className,
}: ThumbnailUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Invalid file type. Please select a JPG, PNG, WebP, or GIF.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 5MB. Please choose a smaller image.");
      return;
    }

    setError(null);
    setUploadSuccess(false);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setUploadSuccess(false);
    onUploadStart(); // Memberi tahu parent component bahwa upload dimulai

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to upload.");

      const fileExtension = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("contest-thumbnails")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("contest-thumbnails").getPublicUrl(fileName);

      onUploadComplete(publicUrl);
      setUploadSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to upload thumbnail.");
      onUploadError(); // Memberi tahu parent component bahwa ada error
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setUploadSuccess(false);
    onUploadComplete(""); // Hapus URL jika file dihapus
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card
      className={`border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white ${className}`}
    >
      <CardHeader className="bg-cyan-400">
        <CardTitle className="text-xl font-black uppercase text-black">
          Contest Thumbnail
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 border-4 border-dashed border-black bg-cyan-50 cursor-pointer hover:bg-cyan-100 transition-colors"
          >
            <UploadCloud className="h-12 w-12 text-black" />
            <p className="mt-4 font-bold text-black">
              CLICK TO UPLOAD THUMBNAIL
            </p>
            <p className="text-xs text-black">PNG, JPG, GIF, WebP (Max 5MB)</p>
          </div>
        ) : (
          <div className="relative">
            <Image
              src={previewUrl}
              alt="Thumbnail Preview"
              width={500}
              height={281}
              className="w-full h-auto object-cover border-4 border-black"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={removeFile}
              className="absolute top-2 right-2 border-2 border-black shadow-md"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="border-2 border-black">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-bold">{error}</AlertDescription>
          </Alert>
        )}

        {uploadSuccess && !error && (
          <Alert className="bg-green-100 border-green-500 border-2 border-black text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="font-bold">
              Thumbnail uploaded successfully!
            </AlertDescription>
          </Alert>
        )}

        {selectedFile && !uploadSuccess && (
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-cyan-500 text-black border-4 border-black hover:bg-cyan-400 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {isUploading ? "UPLOADING..." : "UPLOAD AND CONFIRM THUMBNAIL"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
