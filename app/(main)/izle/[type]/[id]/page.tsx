"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, List, MonitorPlay, Info } from "lucide-react";
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
  const [showInfo, setShowInfo] = useState(false);

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

  const videoSrc = episode?.videoUrl || (content as Movie)?.videoUrl || (content as Series)?.videoUrl || "";
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

  const handlePreviousEpisode = () => {
    if (type !== "seri" && type !== "series") return;
    const episodes = (content as Series)?.episodes || [];
    const currentIndex = episodes.findIndex((e: Episode) => e.id === episode?.id);
    if (currentIndex > 0) {
      const prev = episodes[currentIndex - 1];
      setEpisode(prev);
      router.replace(`/izle/seri/${id}?episode=${prev.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-2 border-wado-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <MonitorPlay className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">İçerik bulunamadı</p>
          <Link href="/" className="text-wado-500 hover:text-wado-400 text-sm mt-2 inline-block">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  const noVideo = !videoSrc;
  const episodes = (type === "seri" || type === "series") ? ((content as Series).episodes || []) : [];
  const currentEpIndex = episodes.findIndex((e: Episode) => e.id === episode?.id);

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 md:px-4 py-2.5 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-sm">
        <Link href={`/${type === "seri" ? "dizi" : "film"}/${id}`} className="flex items-center gap-2 text-white hover:text-wado-400 transition-colors group">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-wado-600/30 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-medium line-clamp-1">{episode?.title || (content as Movie).title}</span>
            {episode && <p className="text-[10px] text-white/50">S{episode.seasonNumber} / B{episode.episodeNumber}</p>}
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {noVideo && (
            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">Video Yok</span>
          )}
          {episodes.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setShowEpisodes(!showEpisodes)} className="text-white/80 hover:text-white">
              <List className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Bölümler</span>
              <span className="sm:hidden">{episodes.length}</span>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setShowInfo(!showInfo)} className="text-white/80 hover:text-white">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 min-w-0">
          <div className="w-full" style={{ height: "100vh" }}>
            {noVideo ? (
              <div className="h-full flex items-center justify-center bg-black/95 flex-col gap-4 px-6">
                <MonitorPlay className="h-16 w-16 text-white/20" />
                <p className="text-white/60 text-lg font-medium">Bu içerik için video bulunamadı</p>
                <p className="text-white/40 text-sm text-center max-w-md">
                  {type === "seri" || type === "series"
                    ? "Bu diziye ait bölüm ve video eklenmemiş. Admin panelden bölüm ekleyip video yükleyin."
                    : "Bu filme video eklenmemiş. Admin panelden filmi düzenleyip video yükleyin."}
                </p>
                <Link href={`/${type === "seri" ? "dizi" : "film"}/${id}`} className="mt-4">
                  <Button variant="outline" className="border-white/20 text-white/80">Detaylara Dön</Button>
                </Link>
              </div>
            ) : (
              <VideoPlayer
                src={videoSrc}
                poster={posterUrl}
                title={episode?.title || (content as Movie).title}
                onNext={currentEpIndex < episodes.length - 1 ? handleNextEpisode : undefined}
                onPrevious={currentEpIndex > 0 ? handlePreviousEpisode : undefined}
                onEnded={currentEpIndex < episodes.length - 1 ? handleNextEpisode : undefined}
                className="h-full"
              />
            )}
          </div>
        </div>

        <AnimatePresence>
          {showEpisodes && episodes.length > 0 && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden md:block bg-black/95 border-l border-white/10 overflow-y-auto flex-shrink-0"
              style={{ height: "100vh" }}
            >
              <div className="sticky top-0 bg-black/95 backdrop-blur-sm p-4 border-b border-white/5 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Bölümler</h3>
                  <button onClick={() => setShowEpisodes(false)} className="text-white/50 hover:text-white p-1">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-white/40 mt-1">{episodes.length} bölüm</p>
              </div>
              <div className="p-3 space-y-1.5">
                {episodes.map((ep: Episode, i: number) => (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setEpisode(ep);
                      router.replace(`/izle/seri/${id}?episode=${ep.id}`);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all ${
                      episode?.id === ep.id
                        ? "bg-wado-600/20 border border-wado-500/30 shadow-lg shadow-wado-600/10"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex gap-2.5">
                      <div className="relative w-28 aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                        <img
                          src={ep.thumbnailUrl || content?.posterUrl || "/images/placeholder-poster.jpg"}
                          alt={ep.title}
                          className="h-full w-full object-cover"
                        />
                        {episode?.id === ep.id && (
                          <div className="absolute inset-0 bg-wado-600/30 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-white/90 flex items-center justify-center">
                              <div className="h-2 w-2 bg-wado-600 rounded-full" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-wado-500 font-semibold uppercase tracking-wider">
                          Bölüm {ep.episodeNumber}
                        </p>
                        <p className="text-sm text-white font-medium truncate">{ep.title}</p>
                        <p className="text-xs text-white/40 line-clamp-2 mt-0.5">{ep.description}</p>
                        {ep.duration && (
                          <p className="text-[10px] text-white/30 mt-1">{Math.floor(ep.duration)}dk</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden md:block bg-black/95 border-l border-white/10 overflow-y-auto flex-shrink-0"
              style={{ height: "100vh" }}
            >
              <div className="sticky top-0 bg-black/95 backdrop-blur-sm p-4 border-b border-white/5 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Bilgi</h3>
                  <button onClick={() => setShowInfo(false)} className="text-white/50 hover:text-white p-1">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden bg-white/5">
                  <img
                    src={content?.posterUrl || "/images/placeholder-poster.jpg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{content.title}</h4>
                  {episode && (
                    <p className="text-sm text-wado-400 mt-1">
                      Sezon {episode.seasonNumber}, Bölüm {episode.episodeNumber}
                    </p>
                  )}
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{content.description}</p>
                {(content as Movie).duration && (
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <span>Süre: {(content as Movie).duration}dk</span>
                  </div>
                )}
                {"imdbRating" in content && content.imdbRating && (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 text-sm font-semibold">⭐ {content.imdbRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showEpisodes && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl"
            style={{ height: "60vh" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-white font-semibold">Bölümler</h3>
              <button onClick={() => setShowEpisodes(false)} className="text-white/50 p-1">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto h-full pb-20 p-3 space-y-2">
              {episodes.map((ep: Episode) => (
                <button
                  key={ep.id}
                  onClick={() => { setEpisode(ep); router.replace(`/izle/seri/${id}?episode=${ep.id}`); setShowEpisodes(false); }}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    episode?.id === ep.id ? "bg-wado-600/20 border border-wado-500/30" : "bg-white/5"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-24 aspect-video rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                      <img src={ep.thumbnailUrl || content?.posterUrl || ""} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-wado-500 font-medium">B{ep.episodeNumber}</p>
                      <p className="text-sm text-white font-medium truncate">{ep.title}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
