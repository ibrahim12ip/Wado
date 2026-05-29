"use client";

import { useState, useRef } from "react";
import { Upload, X, FileVideo, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({ value, onChange, accept = "video/mp4,video/webm", label = "Video Yükle" }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["mp4", "webm", "mkv", "mov", "avi"].includes(ext || "")) {
      toast.error("Sadece video dosyaları yüklenebilir");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const d = await res.json();
      if (d.success) {
        setPreview(d.data.url);
        onChange(d.data.url);
        toast.success("Video yüklendi");
      } else {
        toast.error(d.error || "Yükleme hatası");
      }
    } catch {
      toast.error("Dosya yüklenemedi");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-white">{label}</label>
      {preview ? (
        <div className="relative">
          <video src={preview} className="w-full h-24 rounded-md bg-black/50 object-cover" />
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/60 px-2 py-0.5 rounded">
            {preview.split("/").pop()}
          </div>
          <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white h-6 w-6" onClick={handleRemove}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-white/20 rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-white/40 transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 text-white/40 animate-spin" />
          ) : (
            <>
              <FileVideo className="h-8 w-8 text-white/40" />
              <span className="text-xs text-muted-foreground">MP4 video dosyası seç</span>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleUpload} disabled={uploading} />
      <Input
        value={value}
        onChange={(e) => { setPreview(e.target.value); onChange(e.target.value); }}
        placeholder="veya video URL'si girin..."
        className="text-xs bg-black/50 border-white/10 text-white"
      />
    </div>
  );
}
