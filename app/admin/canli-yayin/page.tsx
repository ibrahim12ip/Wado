"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function AdminLivePage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", streamUrl: "", hlsUrl: "", thumbnailUrl: "", scheduledAt: "", isLive: false });

  const fetchStreams = useCallback(async () => {
    const res = await fetch("/api/live");
    const d = await res.json();
    if (d.success) setStreams(d.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStreams(); }, [fetchStreams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editing ? `/api/live/${editing.id}` : "/api/live";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await res.json();
      if (d.success) {
        toast.success(editing ? "Güncellendi" : "Eklendi");
        setForm({ title: "", description: "", streamUrl: "", hlsUrl: "", thumbnailUrl: "", scheduledAt: "", isLive: false });
        setShowForm(false); setEditing(null);
        fetchStreams();
      } else toast.error(d.error);
    } catch { toast.error("Hata oluştu"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/live/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) { toast.success("Silindi"); fetchStreams(); }
    else toast.error(d.error);
  };

  const startEdit = (s: any) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description || "", streamUrl: s.streamUrl || "", hlsUrl: s.hlsUrl || "", thumbnailUrl: s.thumbnailUrl || "", scheduledAt: s.scheduledAt ? s.scheduledAt.slice(0, 16) : "", isLive: s.isLive });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Canlı Yayın</h1>
        <Button onClick={() => { setEditing(null); setForm({ title: "", description: "", streamUrl: "", hlsUrl: "", thumbnailUrl: "", scheduledAt: "", isLive: false }); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4 mr-1" />{showForm ? "Listeye Dön" : "Yayın Ekle"}
        </Button>
      </div>

      {showForm && (
        <div className="glass-dark rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{editing ? "Yayın Düzenle" : "Yeni Yayın"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm text-white">Başlık *</label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div className="space-y-2"><label className="text-sm text-white">Stream URL</label><Input value={form.streamUrl} onChange={(e) => setForm(f => ({ ...f, streamUrl: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">HLS URL</label><Input value={form.hlsUrl} onChange={(e) => setForm(f => ({ ...f, hlsUrl: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Thumbnail URL</label><Input value={form.thumbnailUrl} onChange={(e) => setForm(f => ({ ...f, thumbnailUrl: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Planlanan Tarih</label><Input value={form.scheduledAt} onChange={(e) => setForm(f => ({ ...f, scheduledAt: e.target.value }))} type="datetime-local" /></div>
              <div className="space-y-2 flex items-center gap-2 pt-6">
                <input type="checkbox" checked={form.isLive} onChange={(e) => setForm(f => ({ ...f, isLive: e.target.checked }))} className="accent-wado-500" />
                <label className="text-sm text-white">Canlı Yayında</label>
              </div>
            </div>
            <div className="space-y-2"><label className="text-sm text-white">Açıklama</label>
              <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white resize-none" />
            </div>
            <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{editing ? "Güncelle" : "Ekle"}</Button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="space-y-4">
          {streams.map((s: any) => (
            <div key={s.id} className="glass-dark rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">{s.title}</p>
                  {s.isLive && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>}
                </div>
                <p className="text-xs text-muted-foreground">{s.description}</p>
                {s.scheduledAt && <p className="text-xs text-muted-foreground mt-1">Plan: {new Date(s.scheduledAt).toLocaleDateString("tr-TR")}</p>}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(s)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
