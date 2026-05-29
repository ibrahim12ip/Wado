"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface ContentFormProps {
  type: "series" | "movie" | "program";
  initialData?: any;
  isEditing?: boolean;
}

export function ContentForm({ type, initialData, isEditing }: ContentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    posterUrl: initialData?.posterUrl || "",
    backdropUrl: initialData?.backdropUrl || "",
    trailerUrl: initialData?.trailerUrl || "",
    videoUrl: initialData?.videoUrl || "",
    hlsUrl: initialData?.hlsUrl || "",
    duration: initialData?.duration?.toString() || "",
    year: initialData?.year?.toString() || "",
    imdbRating: initialData?.imdbRating?.toString() || "",
    contentRating: initialData?.contentRating || "",
    featured: initialData?.featured || false,
    categoryId: initialData?.categoryId || "",
    isActive: initialData?.isActive ?? true,
  });

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => { if (d.success) setCategories(d.data); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = type === "series" ? "/api/series" : type === "movie" ? "/api/movies" : "/api/programs";
      const url = isEditing ? `${endpoint}/${initialData.id}` : endpoint;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "Güncellendi" : "Eklendi");
        router.refresh();
      } else {
        toast.error(data.error || "Hata oluştu");
      }
    } catch {
      toast.error("Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-dark rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Temel Bilgiler</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white">Başlık *</label>
            <Input value={form.title} onChange={(e) => updateField("title", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white">Kategori</label>
            <select
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className="w-full h-10 rounded-md border border-white/20 bg-black/50 px-3 text-sm text-white"
            >
              <option value="">Kategori Seç</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white">Açıklama</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white resize-none"
          />
        </div>
      </div>

      <div className="glass-dark rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Görseller & Medya</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white">Poster URL</label>
            <Input value={form.posterUrl} onChange={(e) => updateField("posterUrl", e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white">Backdrop URL</label>
            <Input value={form.backdropUrl} onChange={(e) => updateField("backdropUrl", e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white">Trailer URL</label>
            <Input value={form.trailerUrl} onChange={(e) => updateField("trailerUrl", e.target.value)} placeholder="https://..." />
          </div>
          {type !== "series" && (
            <div className="space-y-2">
              <label className="text-sm text-white">Video URL</label>
              <Input value={form.videoUrl} onChange={(e) => updateField("videoUrl", e.target.value)} placeholder="https://..." />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm text-white">HLS URL</label>
            <Input value={form.hlsUrl} onChange={(e) => updateField("hlsUrl", e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </div>

      <div className="glass-dark rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Detaylar</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white">Yıl</label>
            <Input value={form.year} onChange={(e) => updateField("year", e.target.value)} type="number" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white">IMDB Puanı</label>
            <Input value={form.imdbRating} onChange={(e) => updateField("imdbRating", e.target.value)} type="number" step="0.1" />
          </div>
          {type !== "series" && (
            <div className="space-y-2">
              <label className="text-sm text-white">Süre (dk)</label>
              <Input value={form.duration} onChange={(e) => updateField("duration", e.target.value)} type="number" />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm text-white">İçerik Derecesi</label>
            <Input value={form.contentRating} onChange={(e) => updateField("contentRating", e.target.value)} placeholder="18+, 13+, vb." />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} className="accent-wado-500" />
            Öne Çıkan
          </label>
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => updateField("isActive", e.target.checked)} className="accent-wado-500" />
            Aktif
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isEditing ? "Güncelle" : "Ekle"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
      </div>
    </form>
  );
}
