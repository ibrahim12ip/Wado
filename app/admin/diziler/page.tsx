"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, ExternalLink, Search, Film, MonitorPlay, MonitorOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentForm } from "@/components/admin/content-form";
import toast from "react-hot-toast";

export default function AdminSeriesPage() {
  const [series, setSeries] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSeries = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/series${search ? `?search=${encodeURIComponent(search)}` : ""}`);
    const d = await res.json();
    if (d.success) setSeries(d.data);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchSeries(); }, [fetchSeries]);

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/series/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) { toast.success("Silindi"); fetchSeries(); }
    else toast.error(d.error);
  };

  const startEdit = (s: any) => {
    setEditing(s);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Diziler</h1>
        <Button onClick={() => { setEditing(null); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Listeye Dön" : "Dizi Ekle"}
        </Button>
      </div>

      {!showForm && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Dizi ara..."
            className="pl-10 bg-black/50 border-white/10 text-white w-full md:w-80"
          />
        </div>
      )}

      {showForm && (
        <div className="mb-8">
          <ContentForm type="series" initialData={editing} isEditing={!!editing} />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)}</div>
      ) : series.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-3">
          <Film className="h-12 w-12 text-white/10" />
          <p>{search ? "Aramanızla eşleşen dizi bulunamadı" : "Henüz dizi eklenmemiş"}</p>
          {!search && <Button variant="outline" onClick={() => { setShowForm(true); }} className="mt-2">İlk Dizi Ekle</Button>}
        </div>
      ) : (
        <div className="glass-dark rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-muted-foreground font-medium">Dizi</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Kategori</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Bölüm</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden lg:table-cell">Video</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">IMDB</th>
                <th className="text-right p-4 text-muted-foreground font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/5">
                        {s.posterUrl ? <img src={s.posterUrl} alt="" className="h-full w-full object-cover" />
                          : <div className="h-full w-full flex items-center justify-center"><Film className="h-4 w-4 text-white/20" /></div>}
                      </div>
                      <div>
                        <p className="text-white font-medium line-clamp-1">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.year || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">
                    {s.category?.name ? <span className="bg-white/5 px-2 py-0.5 rounded-full text-xs">{s.category.name}</span> : "—"}
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{s._count?.episodes || 0}</td>
                  <td className="p-4 hidden lg:table-cell">
                    {s.videoUrl || s.hlsUrl ? (
                      <span className="flex items-center gap-1 text-xs text-green-400"><MonitorPlay className="h-3 w-3" /> Var</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-white/30"><MonitorOff className="h-3 w-3" /> Yok</span>
                    )}
                  </td>
                  <td className="p-4 hidden md:table-cell">{s.imdbRating ? <span className="text-yellow-500 font-medium">{s.imdbRating}</span> : "—"}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dizi/${s.id}`} target="_blank"><Button variant="ghost" size="icon" className="text-white/50 hover:text-white"><ExternalLink className="h-4 w-4" /></Button></Link>
                      <Button variant="ghost" size="icon" onClick={() => startEdit(s)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 border-t border-white/5 text-xs text-muted-foreground text-center">
            Toplam {series.length} dizi
          </div>
        </div>
      )}
    </div>
  );
}
