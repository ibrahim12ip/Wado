"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import toast from "react-hot-toast";

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", posterUrl: "", backdropUrl: "", videoUrl: "", duration: "", live: false, liveUrl: "", schedule: "", categoryId: "" });

  const fetchAll = useCallback(async () => {
    const [p, c] = await Promise.all([fetch("/api/programs").then(r => r.json()), fetch("/api/categories").then(r => r.json())]);
    if (p.success) setPrograms(p.data);
    if (c.success) setCategories(c.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editing ? `/api/programs/${editing.id}` : "/api/programs";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await res.json();
      if (d.success) {
        toast.success(editing ? "Güncellendi" : "Eklendi");
        setForm({ title: "", description: "", posterUrl: "", backdropUrl: "", videoUrl: "", duration: "", live: false, liveUrl: "", schedule: "", categoryId: "" });
        setShowForm(false); setEditing(null);
        fetchAll();
      } else toast.error(d.error);
    } catch { toast.error("Hata oluştu"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) { toast.success("Silindi"); fetchAll(); }
    else toast.error(d.error);
  };

  const startEdit = (p: any) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description || "", posterUrl: p.posterUrl || "", backdropUrl: p.backdropUrl || "", videoUrl: p.videoUrl || "", duration: p.duration?.toString() || "", live: p.live || false, liveUrl: p.liveUrl || "", schedule: p.schedule || "", categoryId: p.categoryId || "" });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Program Yönetimi</h1>
        <Button onClick={() => { setEditing(null); setForm({ title: "", description: "", posterUrl: "", backdropUrl: "", videoUrl: "", duration: "", live: false, liveUrl: "", schedule: "", categoryId: "" }); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4 mr-1" />{showForm ? "Listeye Dön" : "Program Ekle"}
        </Button>
      </div>

      {showForm && (
        <div className="glass-dark rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{editing ? "Program Düzenle" : "Yeni Program"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm text-white">Başlık *</label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div className="space-y-2"><label className="text-sm text-white">Kategori</label>
                <select value={form.categoryId} onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full h-10 rounded-md border border-white/20 bg-black/50 px-3 text-sm text-white">
                  <option value="">Kategori Seç</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2"><label className="text-sm text-white">Poster URL</label><Input value={form.posterUrl} onChange={(e) => setForm(f => ({ ...f, posterUrl: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Backdrop URL</label><Input value={form.backdropUrl} onChange={(e) => setForm(f => ({ ...f, backdropUrl: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><FileUpload value={form.videoUrl} onChange={(v) => setForm(f => ({ ...f, videoUrl: v }))} label="Video (MP4)" /></div>
              <div className="space-y-2"><label className="text-sm text-white">Süre (dk)</label><Input value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} type="number" /></div>
              <div className="space-y-2"><label className="text-sm text-white">Canlı Yayın URL</label><Input value={form.liveUrl} onChange={(e) => setForm(f => ({ ...f, liveUrl: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Yayın Takvimi</label><Input value={form.schedule} onChange={(e) => setForm(f => ({ ...f, schedule: e.target.value }))} /></div>
              <div className="space-y-2 flex items-center gap-2 pt-6">
                <input type="checkbox" checked={form.live} onChange={(e) => setForm(f => ({ ...f, live: e.target.checked }))} className="accent-wado-500" />
                <label className="text-sm text-white">Canlı Yayın</label>
              </div>
            </div>
            <div className="space-y-2"><label className="text-sm text-white">Açıklama</label>
              <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white resize-none" />
            </div>
            <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{editing ? "Güncelle" : "Ekle"}</Button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="glass-dark rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-muted-foreground font-medium">Program</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Kategori</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Süre</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Canlı</th>
                <th className="text-right p-4 text-muted-foreground font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((p: any) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4"><p className="text-white">{p.title}</p></td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{p.category?.name || "—"}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{p.duration ? `${p.duration}dk` : "—"}</td>
                  <td className="p-4 hidden md:table-cell">{p.live ? <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">LIVE</span> : "—"}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
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
