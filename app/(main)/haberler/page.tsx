"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Newspaper, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { News } from "@/types";

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news").then(r => r.json()).then(d => { if (d.success) setNews(d.data); }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Haberler</h1>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">Henüz haber bulunmuyor</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/haberler/${item.slug}`} className="block group">
                  <div className="glass-dark rounded-xl overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={item.imageUrl || "/images/placeholder-poster.jpg"} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white group-hover:text-wado-400 transition-colors line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(new Date(item.createdAt))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
