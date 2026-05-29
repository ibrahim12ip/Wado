"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/components/admin/content-form";
import toast from "react-hot-toast";

export default function AdminSeriesPage() {
  const [series, setSeries] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSeries = async () => {
    const res = await fetch("/api/series");
    const d = await res.json();
    if (d.success) setSeries(d.data);
    setLoading(false);
  };

  useEffect(() => { fetchSeries(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/series/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) { toast.success("Silindi"); fetchSeries(); }
    else toast.error(d.error);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Diziler</h1>
        <Button onClick={() => { setEditing(null); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Listeye Dön" : "Dizi Ekle"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ContentForm type="series" initialData={editing} isEditing={!!editing} />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)}</div>
      ) : series.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Henüz dizi eklenmemiş</div>
      ) : (
        <div className="glass-dark rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-muted-foreground font-medium">Dizi</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Kategori</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Bölüm</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">IMDB</th>
                <th className="text-right p-4 text-muted-foreground font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-8 rounded overflow-hidden bg-white/5 flex-shrink-0">
                        {s.posterUrl && <img src={s.posterUrl} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.year || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{s.category?.name || "—"}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{s._count?.episodes || 0}</td>
                  <td className="p-4 hidden md:table-cell">{s.imdbRating ? <span className="text-yellow-500">{s.imdbRating}</span> : "—"}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dizi/${s.id}`} target="_blank"><Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button></Link>
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(s); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
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
