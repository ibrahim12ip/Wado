"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function AdminActorsPage() {
  const [actors, setActors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", photoUrl: "", birthDate: "", birthPlace: "" });

  const fetchActors = useCallback(async () => {
    const res = await fetch("/api/actors");
    const d = await res.json();
    if (d.success) setActors(d.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchActors(); }, [fetchActors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editing ? `/api/actors/${editing.id}` : "/api/actors";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await res.json();
      if (d.success) {
        toast.success(editing ? "Güncellendi" : "Eklendi");
        setForm({ name: "", bio: "", photoUrl: "", birthDate: "", birthPlace: "" });
        setShowForm(false); setEditing(null);
        fetchActors();
      } else toast.error(d.error);
    } catch { toast.error("Hata oluştu"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/actors/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) { toast.success("Silindi"); fetchActors(); }
    else toast.error(d.error);
  };

  const startEdit = (a: any) => {
    setEditing(a);
    setForm({ name: a.name, bio: a.bio || "", photoUrl: a.photoUrl || "", birthDate: a.birthDate ? a.birthDate.split("T")[0] : "", birthPlace: a.birthPlace || "" });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Oyuncular</h1>
        <Button onClick={() => { setEditing(null); setForm({ name: "", bio: "", photoUrl: "", birthDate: "", birthPlace: "" }); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4 mr-1" />{showForm ? "Listeye Dön" : "Oyuncu Ekle"}
        </Button>
      </div>

      {showForm && (
        <div className="glass-dark rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{editing ? "Oyuncu Düzenle" : "Yeni Oyuncu"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm text-white">Ad Soyad *</label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div className="space-y-2"><label className="text-sm text-white">Doğum Yeri</label><Input value={form.birthPlace} onChange={(e) => setForm(f => ({ ...f, birthPlace: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Doğum Tarihi</label><Input value={form.birthDate} onChange={(e) => setForm(f => ({ ...f, birthDate: e.target.value }))} type="date" /></div>
              <div className="space-y-2"><label className="text-sm text-white">Fotoğraf URL</label><Input value={form.photoUrl} onChange={(e) => setForm(f => ({ ...f, photoUrl: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><label className="text-sm text-white">Biyografi</label>
              <textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white resize-none" />
            </div>
            <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{editing ? "Güncelle" : "Ekle"}</Button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {actors.map((a: any) => (
            <div key={a.id} className="glass-dark rounded-xl p-4 text-center group relative">
              <div className="h-20 w-20 rounded-full mx-auto overflow-hidden border-2 border-white/10 group-hover:border-wado-500 transition-all mb-3">
                <img src={a.photoUrl || "/images/placeholder-actor.jpg"} alt={a.name} className="h-full w-full object-cover" />
              </div>
              <p className="text-sm text-white font-medium truncate">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a._count?.series || 0} dizi, {a._count?.movies || 0} film</p>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(a)} className="h-7 w-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80"><Pencil className="h-3.5 w-3.5 text-white" /></button>
                <button onClick={() => handleDelete(a.id)} className="h-7 w-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80"><Trash2 className="h-3.5 w-3.5 text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
