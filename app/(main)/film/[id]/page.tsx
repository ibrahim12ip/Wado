"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star, Clock, Calendar, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetailSkeleton } from "@/components/shared/skeleton";
import { formatDuration } from "@/lib/utils";
import { useSession } from "next-auth/react";
import type { Movie, Actor } from "@/types";

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`);
        const data = await res.json();
        if (data.success) setMovie(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleFavorite = async () => {
    if (!session) return router.push("/login");
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId: id }),
    });
    const data = await res.json();
    if (data.success) setIsFavorited(!isFavorited);
  };

  if (loading) return <DetailSkeleton />;
  if (!movie) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Film bulunamadı</p></div>;

  const actors = (movie.actors as unknown as { actor: Actor }[])?.map((ma) => ma.actor) || [];

  return (
    <div className="min-h-screen">
      <div className="relative h-[50vh] md:h-[70vh]">
        <Image src={movie.backdropUrl || movie.posterUrl || "/images/placeholder-poster.jpg"} alt={movie.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-40 md:-mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 w-48 md:w-64">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <Image src={movie.posterUrl || "/images/placeholder-poster.jpg"} alt={movie.title} fill className="object-cover" sizes="(max-width: 768px) 192px, 256px" />
            </div>
          </div>

          <div className="flex-1 pt-48 md:pt-64">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="premium" className="mb-3">Film</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {movie.imdbRating && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="text-white font-semibold">{movie.imdbRating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">IMDB</span>
                  </div>
                )}
                {movie.year && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{movie.year}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{formatDuration(movie.duration)}</span>
                  </div>
                )}
                {movie.contentRating && <Badge variant="outline">{movie.contentRating}</Badge>}
              </div>

              <p className="text-gray-300 max-w-2xl mb-8 leading-relaxed">{movie.description}</p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link href={`/izle/film/${id}`}>
                  <Button size="lg" className="bg-wado-600 hover:bg-wado-700 shadow-xl shadow-wado-600/30">
                    <Play className="h-5 w-5 mr-2 fill-white" /> İzle
                  </Button>
                </Link>
                <Button size="lg" variant="outline" onClick={handleFavorite} className={isFavorited ? "border-wado-500 text-wado-500" : ""}>
                  <Heart className={`h-5 w-5 mr-2 ${isFavorited ? "fill-wado-500" : ""}`} />
                  {isFavorited ? "Favorilerde" : "Favorilere Ekle"}
                </Button>
                <Button size="lg" variant="ghost"><Share2 className="h-5 w-5 mr-2" /> Paylaş</Button>
              </div>

              {actors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Oyuncular</h3>
                  <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                    {actors.map((actor: Actor) => (
                      <Link key={actor.id} href={`/oyuncu/${actor.id}`} className="flex-shrink-0 text-center group">
                        <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-wado-500 transition-all mx-auto">
                          <Image src={actor.photoUrl || "/images/placeholder-actor.jpg"} alt={actor.name} width={80} height={80} className="object-cover h-full w-full group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-xs text-white mt-2 group-hover:text-wado-400 transition-colors">{actor.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
