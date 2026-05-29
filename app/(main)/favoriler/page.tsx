"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { ContentCard } from "@/components/shared/content-card";
import { ContentCardSkeleton } from "@/components/shared/skeleton";
import type { Favorite } from "@/types";

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;

    fetch("/api/favorites")
      .then((r) => r.json())
      .then((d) => { if (d.success) setFavorites(d.data); })
      .finally(() => setLoading(false));
  }, [status, router]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6 text-wado-500" />
          <h1 className="text-3xl font-bold text-white">Favorilerim</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => <ContentCardSkeleton key={i} />)}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">Henüz favori içeriğiniz yok</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Dizi ve filmleri favorilerinize ekleyin</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favorites.map((fav) => {
              const item = fav.series || fav.movie;
              if (!item) return null;
              return (
                <ContentCard
                  key={fav.id}
                  id={item.id}
                  title={item.title}
                  posterUrl={item.posterUrl}
                  imdbRating={item.imdbRating}
                  year={item.year}
                  type={fav.series ? "series" : "movie"}
                />
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
