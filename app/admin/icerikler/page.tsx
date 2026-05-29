"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Film, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminIceriklerPage() {
  const [seriesCount, setSeriesCount] = useState(0);
  const [movieCount, setMovieCount] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/series").then(r => r.json()),
      fetch("/api/movies").then(r => r.json()),
    ]).then(([s, m]) => {
      if (s.success) setSeriesCount(s.total || s.data?.length || 0);
      if (m.success) setMovieCount(m.total || m.data?.length || 0);
    });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">İçerik Yönetimi</h1>
        <div className="flex gap-2">
          <Link href="/admin/diziler"><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Dizi Ekle</Button></Link>
          <Link href="/admin/filmler"><Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Film Ekle</Button></Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/admin/diziler" className="glass-dark rounded-xl p-6 hover:border-wado-500/30 transition-all group">
          <Tv className="h-10 w-10 text-wado-500 mb-4" />
          <h2 className="text-xl font-semibold text-white group-hover:text-wado-400 transition-colors">Diziler</h2>
          <p className="text-3xl font-bold text-white mt-2">{seriesCount}</p>
          <p className="text-sm text-muted-foreground mt-1">dizi bulunuyor</p>
        </Link>
        <Link href="/admin/filmler" className="glass-dark rounded-xl p-6 hover:border-wado-500/30 transition-all group">
          <Film className="h-10 w-10 text-wado-500 mb-4" />
          <h2 className="text-xl font-semibold text-white group-hover:text-wado-400 transition-colors">Filmler</h2>
          <p className="text-3xl font-bold text-white mt-2">{movieCount}</p>
          <p className="text-sm text-muted-foreground mt-1">film bulunuyor</p>
        </Link>
      </div>
    </div>
  );
}
