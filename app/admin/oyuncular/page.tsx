"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function AdminActorsPage() {
  const [actors, setActors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", photoUrl: "", birthPlace: "" });

  const fetchActors = async () => {
    const res = await fetch("/api/actors");
    const d = await res.json();
    if (d.success) setActors(d.data);
    setLoading(false);
  };

  useEffect(() => { fetchActors(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/actors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (d.success) {
      toast.success("Oyuncu eklendi");
      setForm({ name: "", bio: "", photoUrl: "", birthPlace: "" });
      setShowForm(false);
      fetchActors();
    } else toast.error(d.error);
    setSubmitting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Oyuncular</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" />Oyuncu Ekle</Button>
      </div>

      {showForm && (
        <div className="glass-dark rounded-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm text-white">Ad Soyad *</label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div className="space-y-2"><label className="text-sm text-white">Doğum Yeri</label><Input value={form.birthPlace} onChange={(e) => setForm(f => ({ ...f, birthPlace: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Fotoğraf URL</label><Input value={form.photoUrl} onChange={(e) => setForm(f => ({ ...f, photoUrl: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><label className="text-sm text-white">Biyografi</label><textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white resize-none" /></div>
            <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Ekle</Button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {actors.map((a: any) => (
            <div key={a.id} className="glass-dark rounded-xl p-4 text-center group">
              <div className="h-20 w-20 rounded-full mx-auto overflow-hidden border-2 border-white/10 group-hover:border-wado-500 transition-all mb-3">
                <img src={a.photoUrl || "/images/placeholder-actor.jpg"} alt={a.name} className="h-full w-full object-cover" />
              </div>
              <p className="text-sm text-white font-medium truncate">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a._count?.series || 0} dizi, {a._count?.movies || 0} film</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
