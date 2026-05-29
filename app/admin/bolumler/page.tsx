"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import toast from "react-hot-toast";

export default function AdminEpisodesPage() {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", episodeNumber: "", seasonNumber: "1", duration: "", thumbnailUrl: "", videoUrl: "", seriesId: "" });

  const fetchAll = useCallback(async () => {
    const [s, e] = await Promise.all([fetch("/api/series").then(r => r.json()), fetch("/api/episodes").then(r => r.json())]);
    if (s.success) setSeries(s.data);
    if (e.success) setEpisodes(e.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editing ? `/api/episodes/${editing.id}` : "/api/episodes";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await res.json();
      if (d.success) {
        toast.success(editing ? "Güncellendi" : "Eklendi");
        setForm({ title: "", description: "", episodeNumber: "", seasonNumber: "1", duration: "", thumbnailUrl: "", videoUrl: "", seriesId: "" });
        setShowForm(false);
        setEditing(null);
        fetchAll();
      } else toast.error(d.error);
    } catch { toast.error("Hata oluştu"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/episodes/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) { toast.success("Silindi"); fetchAll(); }
    else toast.error(d.error);
  };

  const startEdit = (ep: any) => {
    setEditing(ep);
    setForm({
      title: ep.title, description: ep.description || "",
      episodeNumber: ep.episodeNumber.toString(), seasonNumber: ep.seasonNumber.toString(),
      duration: ep.duration?.toString() || "", thumbnailUrl: ep.thumbnailUrl || "",
      videoUrl: ep.videoUrl || "", seriesId: ep.seriesId,
    });
    setShowForm(true);
  };

  const filtered = selectedSeries ? episodes.filter((e: any) => e.seriesId === selectedSeries) : episodes;
  const seriesMap = Object.fromEntries(series.map((s: any) => [s.id, s]));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Bölüm Yönetimi</h1>
        <Button onClick={() => { setEditing(null); setForm({ title: "", description: "", episodeNumber: "", seasonNumber: "1", duration: "", thumbnailUrl: "", videoUrl: "", seriesId: "" }); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4 mr-1" />{showForm ? "Listeye Dön" : "Bölüm Ekle"}
        </Button>
      </div>

      {showForm && (
        <div className="glass-dark rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{editing ? "Bölüm Düzenle" : "Yeni Bölüm"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm text-white">Dizi *</label>
                <select value={form.seriesId} onChange={(e) => setForm(f => ({ ...f, seriesId: e.target.value }))} required className="w-full h-10 rounded-md border border-white/20 bg-black/50 px-3 text-sm text-white">
                  <option value="">Dizi Seç</option>
                  {series.map((s: any) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div className="space-y-2"><label className="text-sm text-white">Bölüm Adı *</label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div className="space-y-2"><label className="text-sm text-white">Bölüm No *</label><Input value={form.episodeNumber} onChange={(e) => setForm(f => ({ ...f, episodeNumber: e.target.value }))} type="number" required /></div>
              <div className="space-y-2"><label className="text-sm text-white">Sezon No</label><Input value={form.seasonNumber} onChange={(e) => setForm(f => ({ ...f, seasonNumber: e.target.value }))} type="number" /></div>
              <div className="space-y-2"><label className="text-sm text-white">Süre (dk)</label><Input value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} type="number" /></div>
              <div className="space-y-2 md:col-span-2"><FileUpload value={form.videoUrl} onChange={(v) => setForm(f => ({ ...f, videoUrl: v }))} label="Video (MP4)" /></div>
              <div className="space-y-2"><label className="text-sm text-white">Thumbnail URL</label><Input value={form.thumbnailUrl} onChange={(e) => setForm(f => ({ ...f, thumbnailUrl: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><label className="text-sm text-white">Açıklama</label>
              <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white resize-none" />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{editing ? "Güncelle" : "Ekle"}
            </Button>
          </form>
        </div>
      )}

      <div className="mb-4">
        <select value={selectedSeries} onChange={(e) => setSelectedSeries(e.target.value)} className="w-64 h-10 rounded-md border border-white/20 bg-black/50 px-3 text-sm text-white">
          <option value="">Tüm Diziler</option>
          {series.map((s: any) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="glass-dark rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-muted-foreground font-medium">Bölüm</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Dizi</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Sezon/Bölüm</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Süre</th>
                <th className="text-right p-4 text-muted-foreground font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ep: any) => (
                <tr key={ep.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4"><p className="text-white">{ep.title}</p></td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{seriesMap[ep.seriesId]?.title || "—"}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">S{ep.seasonNumber} / B{ep.episodeNumber}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{ep.duration ? `${ep.duration}dk` : "—"}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(ep)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(ep.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
