"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function AdminBannerPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", linkUrl: "", linkText: "Şimdi İzle" });

  const fetchBanners = async () => {
    const res = await fetch("/api/banners");
    const d = await res.json();
    if (d.success) setBanners(d.data);
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/banners", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (d.success) { toast.success("Banner eklendi"); setShowForm(false); setForm({ title: "", description: "", imageUrl: "", linkUrl: "", linkText: "Şimdi İzle" }); fetchBanners(); }
    else toast.error(d.error);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Banner Yönetimi</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" />Banner Ekle</Button>
      </div>

      {showForm && (
        <div className="glass-dark rounded-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm text-white">Başlık</label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Image URL</label><Input value={form.imageUrl} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Link URL</label><Input value={form.linkUrl} onChange={(e) => setForm(f => ({ ...f, linkUrl: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Link Text</label><Input value={form.linkText} onChange={(e) => setForm(f => ({ ...f, linkText: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><label className="text-sm text-white">Açıklama</label><textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white resize-none" /></div>
            <Button type="submit">Ekle</Button>
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
              <div className="flex-1"><p className="text-white font-medium">{b.title}</p><p className="text-xs text-muted-foreground line-clamp-1">{b.description}</p></div>
              <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
