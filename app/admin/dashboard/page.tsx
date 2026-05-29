"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Film, Tv, Users, Clapperboard, Eye, Star, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentSeries, setRecentSeries] = useState<any[]>([]);
  const [recentMovies, setRecentMovies] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setStats(d.data.counts);
          setRecentSeries(d.data.recentSeries || []);
          setRecentMovies(d.data.recentMovies || []);
          setRecentUsers(d.data.recentUsers || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Diziler", value: stats.series || 0, icon: Tv, color: "from-blue-600 to-blue-800" },
    { label: "Filmler", value: stats.movies || 0, icon: Film, color: "from-purple-600 to-purple-800" },
    { label: "Bölümler", value: stats.episodes || 0, icon: Clapperboard, color: "from-green-600 to-green-800" },
    { label: "Kullanıcılar", value: stats.users || 0, icon: Users, color: "from-wado-600 to-wado-800" },
    { label: "Oyuncular", value: stats.actors || 0, icon: Star, color: "from-yellow-600 to-yellow-800" },
    { label: "Programlar", value: stats.programs || 0, icon: Eye, color: "from-pink-600 to-pink-800" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br border border-white/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-10" />
            <card.icon className="h-8 w-8 text-wado-500 mb-2" />
            <p className="text-2xl font-bold text-white">{loading ? "..." : card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-dark rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Son Eklenen Diziler</h2>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />)}</div>
          ) : recentSeries.length === 0 ? (
            <p className="text-muted-foreground text-sm">Henüz dizi eklenmemiş</p>
          ) : (
            <div className="space-y-2">
              {recentSeries.map((s: any) => (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="h-10 w-7 rounded overflow-hidden bg-white/5 flex-shrink-0">
                    {s.posterUrl && <img src={s.posterUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.category?.name || "Kategorisiz"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-dark rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Son Eklenen Filmler</h2>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />)}</div>
          ) : recentMovies.length === 0 ? (
            <p className="text-muted-foreground text-sm">Henüz film eklenmemiş</p>
          ) : (
            <div className="space-y-2">
              {recentMovies.map((m: any) => (
                <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="h-10 w-7 rounded overflow-hidden bg-white/5 flex-shrink-0">
                    {m.posterUrl && <img src={m.posterUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.category?.name || "Kategorisiz"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-dark rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Son Kullanıcılar</h2>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />)}</div>
          ) : recentUsers.length === 0 ? (
            <p className="text-muted-foreground text-sm">Henüz kullanıcı yok</p>
          ) : (
            <div className="space-y-2">
              {recentUsers.map((u: any) => (
                <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-wado-600/20 flex items-center justify-center text-wado-500 text-sm font-medium flex-shrink-0">
                    {(u.name?.[0] || "U").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{u.name || "İsimsiz"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-wado-600/20 text-wado-400" : "bg-white/5 text-muted-foreground"}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
