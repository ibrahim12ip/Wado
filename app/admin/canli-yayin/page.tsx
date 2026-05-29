"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function AdminLivePage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", streamUrl: "", hlsUrl: "", isLive: false });

  useEffect(() => {
    fetch("/api/live").then(r => r.json()).then(d => { if (d.success) setStreams(d.data); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/live", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    if (d.success) { toast.success("Yayın eklendi"); setShowForm(false); setForm({ title: "", description: "", streamUrl: "", hlsUrl: "", isLive: false }); }
    else toast.error(d.error);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Canlı Yayın</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" />Yayın Ekle</Button>
      </div>

      {showForm && (
        <div className="glass-dark rounded-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm text-white">Başlık</label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">Stream URL</label><Input value={form.streamUrl} onChange={(e) => setForm(f => ({ ...f, streamUrl: e.target.value }))} /></div>
              <div className="space-y-2"><label className="text-sm text-white">HLS URL</label><Input value={form.hlsUrl} onChange={(e) => setForm(f => ({ ...f, hlsUrl: e.target.value }))} /></div>
              <div className="space-y-2 flex items-center gap-2 pt-6">
                <input type="checkbox" checked={form.isLive} onChange={(e) => setForm(f => ({ ...f, isLive: e.target.checked }))} className="accent-wado-500" />
                <label className="text-sm text-white">Canlı Yayında</label>
              </div>
            </div>
            <div className="space-y-2"><label className="text-sm text-white">Açıklama</label><textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white resize-none" /></div>
            <Button type="submit">Ekle</Button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {streams.map((s: any) => (
          <div key={s.id} className="glass-dark rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white font-medium">{s.title}</p>
                {s.isLive && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>}
              </div>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
