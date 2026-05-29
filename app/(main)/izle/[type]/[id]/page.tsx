"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, List, MonitorPlay, Maximize } from "lucide-react";
import { VideoPlayer } from "@/components/player/video-player";
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/shared/skeleton";
import type { Series, Episode, Movie } from "@/types";

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = params.type as string;
  const id = params.id as string;
  const episodeId = searchParams.get("episode");

  const [content, setContent] = useState<Series | Movie | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (type === "seri" || type === "series") {
          const res = await fetch(`/api/series/${id}`);
          const data = await res.json();
          if (data.success) {
            setContent(data.data);
            const episodes = data.data.episodes || [];
            if (episodeId) {
              setEpisode(episodes.find((e: Episode) => e.id === episodeId) || episodes[0]);
            } else {
              setEpisode(episodes[0]);
            }
          }
        } else {
          const res = await fetch(`/api/movies/${id}`);
          const data = await res.json();
          if (data.success) setContent(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id, type, episodeId]);

  const videoSrc = episode?.hlsUrl || episode?.videoUrl || (content as Movie)?.hlsUrl || (content as Movie)?.videoUrl || (content as Series)?.hlsUrl || (content as Series)?.videoUrl || "";
  const posterUrl = episode?.thumbnailUrl || content?.backdropUrl || content?.posterUrl || undefined;

  const handleNextEpisode = () => {
    if (type !== "seri" && type !== "series") return;
    const episodes = (content as Series)?.episodes || [];
    const currentIndex = episodes.findIndex((e: Episode) => e.id === episode?.id);
    if (currentIndex < episodes.length - 1) {
      const next = episodes[currentIndex + 1];
      setEpisode(next);
      router.replace(`/izle/seri/${id}?episode=${next.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Skeleton className="h-[80vh] w-full rounded-none" />
      </div>
    );
  }

  if (!content) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">İçerik bulunamadı</p></div>;
  }

  const noVideo = !videoSrc;

  const episodes = (type === "seri" || type === "series") ? (content as Series).episodes : [];

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
        <Link href={`/${type === "seri" ? "dizi" : "film"}/${id}`} className="flex items-center gap-2 text-white hover:text-wado-400 transition-colors">
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm font-medium">{episode?.title || (content as Movie).title}</span>
        </Link>
        <div className="flex items-center gap-2">
          {episodes && episodes.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setShowEpisodes(!showEpisodes)}>
              <List className="h-4 w-4 mr-1" /> Bölümler
            </Button>
          )}
        </div>
      </div>

      <div className="flex">
        <div className="flex-1">
          <div className="w-full" style={{ height: "100vh", maxHeight: "100vh" }}>
            {noVideo ? (
              <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-2">
                <p className="text-lg">Bu içerik için video bulunamadı</p>
                <p className="text-sm">Admin panelden dizi/film URL'si ekleyin</p>
              </div>
            ) : (
            <VideoPlayer
              src={videoSrc}
              poster={posterUrl}
              title={episode?.title || (content as Movie).title}
              onNext={handleNextEpisode}
              onEnded={handleNextEpisode}
              className="h-full"
            />)}
          </div>
        </div>

        {showEpisodes && episodes && episodes.length > 0 && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden md:block bg-black/95 border-l border-white/10 overflow-y-auto"
            style={{ height: "100vh" }}
          >
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-white mb-4">Bölümler</h3>
              {episodes.map((ep: Episode) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setEpisode(ep);
                    router.replace(`/izle/seri/${id}?episode=${ep.id}`);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    episode?.id === ep.id ? "bg-wado-600/20 border border-wado-500/30" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative w-24 aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                      <img src={ep.thumbnailUrl || content?.posterUrl || "/images/placeholder-poster.jpg"} alt={ep.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-wado-500 font-medium">Bölüm {ep.episodeNumber}</p>
                      <p className="text-sm text-white font-medium truncate">{ep.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{ep.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
