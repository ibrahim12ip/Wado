"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star, Clock, Calendar, Heart, Share2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentCard } from "@/components/shared/content-card";
import { DetailSkeleton } from "@/components/shared/skeleton";
import { formatDuration, formatDate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import type { Series, Episode, Actor } from "@/types";

export default function SeriesDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeSeason, setActiveSeason] = useState(1);
  const [showAllSeasons, setShowAllSeasons] = useState(false);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await fetch(`/api/series/${id}`);
        const data = await res.json();
        if (data.success) setSeries(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [id]);

  const handleFavorite = async () => {
    if (!session) return router.push("/login");
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesId: id }),
      });
      const data = await res.json();
      if (data.success) setIsFavorited(!isFavorited);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!series) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Dizi bulunamadı</p></div>;

  const seasons = [...new Set(series.episodes?.map((e: Episode) => e.seasonNumber) || [])].sort();
  const currentEpisodes = series.episodes?.filter((e: Episode) => e.seasonNumber === activeSeason) || [];
  const actors = (series.actors as unknown as { actor: Actor }[])?.map((sa) => sa.actor) || [];

  return (
    <div className="min-h-screen">
      <div className="relative h-[50vh] md:h-[70vh]">
        <Image
          src={series.backdropUrl || series.posterUrl || "/images/placeholder-poster.jpg"}
          alt={series.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-40 md:-mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 w-48 md:w-64">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <Image
                src={series.posterUrl || "/images/placeholder-poster.jpg"}
                alt={series.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 256px"
              />
            </div>
          </div>

          <div className="flex-1 pt-48 md:pt-64">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="premium" className="mb-3">Wado Exclusive</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{series.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {series.imdbRating && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="text-white font-semibold">{series.imdbRating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">IMDB</span>
                  </div>
                )}
                {series.year && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{series.year}</span>
                  </div>
                )}
                {series.contentRating && (
                  <Badge variant="outline">{series.contentRating}</Badge>
                )}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{series.episodes?.length || 0} Bölüm</span>
                </div>
              </div>

              <p className="text-gray-300 max-w-2xl mb-8 leading-relaxed">{series.description}</p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link href={`/izle/seri/${id}`}>
                  <Button size="lg" className="bg-wado-600 hover:bg-wado-700 shadow-xl shadow-wado-600/30">
                    <Play className="h-5 w-5 mr-2 fill-white" /> İzlemeye Başla
                  </Button>
                </Link>
                <Button size="lg" variant="outline" onClick={handleFavorite} className={isFavorited ? "border-wado-500 text-wado-500" : ""}>
                  <Heart className={`h-5 w-5 mr-2 ${isFavorited ? "fill-wado-500" : ""}`} />
                  {isFavorited ? "Favorilerde" : "Favorilere Ekle"}
                </Button>
                <Button size="lg" variant="ghost">
                  <Share2 className="h-5 w-5 mr-2" /> Paylaş
                </Button>
              </div>

              {actors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Oyuncular</h3>
                  <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                    {actors.map((actor: Actor) => (
                      <Link key={actor.id} href={`/oyuncu/${actor.id}`} className="flex-shrink-0 text-center group">
                        <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-wado-500 transition-all mx-auto">
                          <Image src={actor.photoUrl || "/images/placeholder-actor.svg"} alt={actor.name} width={80} height={80} className="object-cover h-full w-full group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-xs text-white mt-2 group-hover:text-wado-400 transition-colors">{actor.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Bölümler</h2>
                <div className="flex gap-2">
                  {seasons.slice(0, showAllSeasons ? seasons.length : 5).map((season) => (
                    <button
                      key={season}
                      onClick={() => setActiveSeason(season)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        activeSeason === season
                          ? "bg-wado-600 text-white"
                          : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"
                      }`}
                    >
                      S.{season}
                    </button>
                  ))}
                  {seasons.length > 5 && (
                    <button onClick={() => setShowAllSeasons(!showAllSeasons)} className="px-3 py-1.5 rounded-full text-sm bg-white/5 text-muted-foreground hover:text-white">
                      {showAllSeasons ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {currentEpisodes.map((episode: Episode, index: number) => (
                  <motion.div
                    key={episode.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/izle/seri/${id}?episode=${episode.id}`}>
                      <div className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                        <div className="relative w-40 md:w-48 aspect-video flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={episode.thumbnailUrl || series.posterUrl || "/images/placeholder-poster.jpg"}
                            alt={episode.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="192px"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-wado-500 font-medium">Bölüm {episode.episodeNumber}</span>
                            {episode.duration && (
                              <span className="text-xs text-muted-foreground">{formatDuration(episode.duration)}</span>
                            )}
                          </div>
                          <h4 className="text-white font-medium truncate group-hover:text-wado-400 transition-colors">{episode.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{episode.description}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
