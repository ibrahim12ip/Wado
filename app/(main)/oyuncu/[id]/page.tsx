"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Film, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContentCard } from "@/components/shared/content-card";
import { ContentCardSkeleton } from "@/components/shared/skeleton";
import { formatDate } from "@/lib/utils";
import type { Actor, Series, Movie } from "@/types";

export default function ActorDetailPage() {
  const { id } = useParams();
  const [actor, setActor] = useState<Actor | null>(null);
  const [series, setSeries] = useState<Series[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actorsRes, seriesRes, moviesRes] = await Promise.all([
          fetch("/api/actors"),
          fetch("/api/series"),
          fetch("/api/movies"),
        ]);

        const actorsData = await actorsRes.json();
        const seriesData = await seriesRes.json();
        const moviesData = await moviesRes.json();

        const found = actorsData.data?.find((a: Actor) => a.id === id);
        setActor(found || null);

        if (found) {
          if (seriesData.success) {
            setSeries(
              seriesData.data.filter((s: Series) =>
                (s.actors as unknown as { actor: Actor }[])?.some(
                  (sa) => sa.actor?.id === id
                )
              )
            );
          }
          if (moviesData.success) {
            setMovies(
              moviesData.data.filter((m: Movie) =>
                (m.actors as unknown as { actor: Actor }[])?.some(
                  (ma) => ma.actor?.id === id
                )
              )
            );
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-48 h-48 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="h-10 w-64 bg-white/5 animate-pulse rounded-lg" />
              <div className="h-5 w-48 bg-white/5 animate-pulse rounded-lg" />
              <div className="h-5 w-48 bg-white/5 animate-pulse rounded-lg" />
              <div className="h-24 w-full max-w-xl bg-white/5 animate-pulse rounded-lg" />
            </div>
          </div>
          <div className="mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
              {[...Array(6)].map((_, i) => (
                <ContentCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Oyuncu bulunamadı</p>
      </div>
    );
  }

  const hasContent = series.length > 0 || movies.length > 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8 items-start"
        >
          <div className="flex-shrink-0">
            <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-white/10 shadow-xl shadow-black/30">
              <Image
                src={actor.photoUrl || "/images/placeholder-actor.svg"}
                alt={actor.name}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
          </div>

          <div className="flex-1 pt-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {actor.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {actor.birthDate && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {formatDate(new Date(actor.birthDate))}
                  </span>
                </div>
              )}
              {actor.birthPlace && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{actor.birthPlace}</span>
                </div>
              )}
              <Badge variant="outline" className="gap-1.5">
                <Tv className="h-3.5 w-3.5" />
                {series.length} Dizi
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Film className="h-3.5 w-3.5" />
                {movies.length} Film
              </Badge>
            </div>

            {actor.bio && (
              <p className="text-gray-300 max-w-2xl leading-relaxed">
                {actor.bio}
              </p>
            )}
          </div>
        </motion.div>

        {hasContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 space-y-10"
          >
            {series.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Tv className="h-5 w-5 text-wado-500" />
                  Rol Aldığı Diziler
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {series.map((s) => (
                    <ContentCard
                      key={s.id}
                      id={s.id}
                      title={s.title}
                      posterUrl={s.posterUrl}
                      imdbRating={s.imdbRating}
                      year={s.year}
                      type="series"
                    />
                  ))}
                </div>
              </section>
            )}

            {movies.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Film className="h-5 w-5 text-wado-500" />
                  Rol Aldığı Filmler
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movies.map((m) => (
                    <ContentCard
                      key={m.id}
                      id={m.id}
                      title={m.title}
                      posterUrl={m.posterUrl}
                      imdbRating={m.imdbRating}
                      year={m.year}
                      type="movie"
                    />
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}

        {!hasContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 text-center py-16"
          >
            <p className="text-muted-foreground">
              Bu oyuncuya ait içerik bulunamadı
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
