"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", content: "", imageUrl: "" });

  const fetchNews = useCallback(async () => {
    const res = await fetch("/api/news");
    const d = await res.json();
    if (d.success) setNews(d.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editing ? `/api/news/${editing.id}` : "/api/news";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await res.json();
      if (d.success) {
        toast.success(editing ? "Güncellendi" : "Eklendi");
        setForm({ title: "", description: "", content: "", imageUrl: "" });
        setShowForm(false); setEditing(null);
        fetchNews();
      } else toast.error(d.error);
    } catch { toast.error("Hata oluştu"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) { toast.success("Silindi"); fetchNews(); }
    else toast.error(d.error);
  };

  const startEdit = (n: any) => {
    setEditing(n);
    setForm({ title: n.title, description: n.description || "", content: n.content || "", imageUrl: n.imageUrl || "" });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Haber Yönetimi</h1>
        <Button onClick={() => { setEditing(null); setForm({ title: "", description: "", content: "", imageUrl: "" }); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4 mr-1" />{showForm ? "Listeye Dön" : "Haber Ekle"}
        </Button>
      </div>

      {showForm && (
        <div className="glass-dark rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{editing ? "Haber Düzenle" : "Yeni Haber"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm text-white">Başlık *</label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div className="space-y-2"><label className="text-sm text-white">Görsel URL</label><Input value={form.imageUrl} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><label className="text-sm text-white">Kısa Açıklama</label>
              <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white resize-none" />
            </div>
            <div className="space-y-2"><label className="text-sm text-white">İçerik (HTML)</label>
              <textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} rows={8} className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white resize-none font-mono" />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{editing ? "Güncelle" : "Ekle"}
            </Button>
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
                <th className="text-left p-4 text-muted-foreground font-medium">Haber</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Tarih</th>
                <th className="text-right p-4 text-muted-foreground font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {news.map((n: any) => (
                <tr key={n.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {n.imageUrl && <div className="h-10 w-16 rounded overflow-hidden bg-white/5 flex-shrink-0"><img src={n.imageUrl} alt="" className="h-full w-full object-cover" /></div>}
                      <div><p className="text-white font-medium">{n.title}</p><p className="text-xs text-muted-foreground line-clamp-1">{n.description}</p></div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{new Date(n.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(n)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(n.id)}><Trash2 className="h-4 w-4" /></Button>
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
