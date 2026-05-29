"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Play, Tv, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProgressColor } from "@/lib/utils";
import type { WatchHistory } from "@/types";

export default function WatchHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<WatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;
    fetch("/api/watch-history").then(r => r.json()).then(d => { if (d.success) setHistory(d.data); }).finally(() => setLoading(false));
  }, [status, router]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="h-6 w-6 text-wado-500" />
          <h1 className="text-3xl font-bold text-white">İzleme Geçmişi</h1>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}</div>
        ) : history.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">Henüz izleme geçmişiniz yok</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => {
              const content = item.series || item.movie;
              if (!content) return null;
              return (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <Link href={`/${item.series ? `dizi/${content.id}` : `film/${content.id}`}`} className="block">
                    <div className="glass-dark rounded-xl p-4 hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                          <img src={content.posterUrl || "/images/placeholder-poster.jpg"} alt={content.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {item.series ? <Tv className="h-3 w-3 text-wado-500" /> : <Film className="h-3 w-3 text-wado-500" />}
                            <p className="text-white font-medium truncate group-hover:text-wado-400 transition-colors">{content.title}</p>
                          </div>
                          {item.episode && <p className="text-xs text-muted-foreground mt-0.5">S{item.episode.seasonNumber} / B{item.episode.episodeNumber}</p>}
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-xs">
                              <div className={`h-full rounded-full ${getProgressColor(item.progress)}`} style={{ width: `${item.progress}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{Math.round(item.progress)}%</span>
                          </div>
                        </div>
                        <Play className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
