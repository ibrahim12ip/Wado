"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ContentCard } from "@/components/shared/content-card";
import { ContentCardSkeleton } from "@/components/shared/skeleton";
import type { Series } from "@/types";

export default function SeriesListPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/series")
      .then((r) => r.json())
      .then((d) => { if (d.success) setSeries(d.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Diziler</h1>
        <p className="text-muted-foreground mb-8">En popüler dizileri keşfedin</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => <ContentCardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {series.map((s) => (
              <ContentCard
                key={s.id}
                id={s.id}
                title={s.title}
                posterUrl={s.posterUrl}
                imdbRating={s.imdbRating}
                year={s.year}
                type="series"
                categoryName={s.category?.name}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
