"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function AdminBannerPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", videoUrl: "", linkUrl: "", linkText: "Şimdi İzle", order: "0" });

  const fetchBanners = useCallback(async () => {
    const res = await fetch("/api/banners");
    const d = await res.json();
    if (d.success) setBanners(d.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editing ? `/api/banners/${editing.id}` : "/api/banners";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: parseInt(form.order) || 0 }) });
      const d = await res.json();
      if (d.success) {
        toast.success(editing ? "Güncellendi" : "Eklendi");
        setForm({ title: "", description: "", imageUrl: "", videoUrl: "", linkUrl: "", linkText: "Şimdi İzle", order: "0" });
        setShowForm(false); setEditing(null);
        fetchBanners();
      } else toast.error(d.error);
    } catch { toast.error("Hata oluştu"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) { toast.success("Silindi"); fetchBanners(); }
    else toast.error(d.error);
  };

  const startEdit = (b: any) => {
    setEditing(b);
    setForm({ title: b.title, description: b.description || "", imageUrl: b.imageUrl || "", videoUrl: b.videoUrl || "", linkUrl: b.linkUrl || "", linkText: b.linkText || "Şimdi İzle", order: b.order?.toString() || "0" });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Banner Yönetimi</h1>
        <Button onClick={() => { setEditing(null); setForm({ title: "", description: "", imageUrl: "", videoUrl: "", linkUrl: "", linkText: "Şimdi İzle", order: "0" }); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4 mr-1" />{showForm ? "Listeye Dön" : "Banner Ekle"}
        </Button>
      </div>

      {showForm && (
        <div className="glass-dark rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{editing ? "Banner Düzenle" : "Yeni Banner"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm text-white">Başlık</label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Sıra</label><Input value={form.order} onChange={(e) => setForm(f => ({ ...f, order: e.target.value }))} type="number" /></div>
              <div className="space-y-2"><label className="text-sm text-white">Görsel URL</label><Input value={form.imageUrl} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Video URL</label><Input value={form.videoUrl} onChange={(e) => setForm(f => ({ ...f, videoUrl: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Link URL</label><Input value={form.linkUrl} onChange={(e) => setForm(f => ({ ...f, linkUrl: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Link Yazısı</label><Input value={form.linkText} onChange={(e) => setForm(f => ({ ...f, linkText: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><label className="text-sm text-white">Açıklama</label>
              <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white resize-none" />
            </div>
            <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{editing ? "Güncelle" : "Ekle"}</Button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="space-y-4">
              {banners.map((b: any) => (
            <div key={b.id} className="glass-dark rounded-xl p-4 flex items-center gap-4">
              {b.imageUrl && <div className="h-16 w-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0"><img src={b.imageUrl} alt="" className="h-full w-full object-cover" /></div>}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">{b.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{b.description}</p>
                {b.linkUrl && <p className="text-xs text-wado-400 truncate mt-1">{b.linkUrl}</p>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => startEdit(b)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(b.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
