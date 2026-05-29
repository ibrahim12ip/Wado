"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipForward, SkipBack, FastForward, Rewind,
} from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onEnded?: () => void;
  className?: string;
}

export function VideoPlayer({
  src, poster, title, onNext, onPrevious, onEnded, className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeout = useRef<NodeJS.Timeout>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentQuality, setCurrentQuality] = useState("Auto");
  const [bufferProgress, setBufferProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [skipIndicator, setSkipIndicator] = useState<{ dir: "forward" | "backward"; sec: number } | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const isHls = src?.endsWith(".m3u8");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    setLoading(true);
    setIsPlaying(false);
    setCurrentTime(0);

    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true, lowLatencyMode: true,
        backBufferLength: 30, maxBufferLength: 30, maxMaxBufferLength: 60,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { setLoading(false); video.play().catch(() => {}); });
      hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
        const levels = hls.levels;
        if (levels?.[data.level]) setCurrentQuality(levels[data.level].height + "p");
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        }
      });
    } else {
      video.src = src;
    }

    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [src, isHls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => setLoading(false);
    const onWait = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("waiting", onWait);
    video.addEventListener("canplay", onCanPlay);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("waiting", onWait);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, [src]);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
    setSkipIndicator({ dir: seconds > 0 ? "forward" : "backward", sec: Math.abs(seconds) });
    setTimeout(() => setSkipIndicator(null), 600);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setIsPlaying(true); }
    else { video.pause(); setIsPlaying(false); }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case " ":
        case "k": e.preventDefault(); togglePlay(); break;
        case "ArrowLeft":
        case ",": e.preventDefault(); skip(-5); break;
        case "ArrowRight":
        case ".": e.preventDefault(); skip(5); break;
        case "ArrowUp": e.preventDefault(); setVolume(v => { const n = Math.min(1, v + 0.1); video.volume = n; setIsMuted(n === 0); return n; }); break;
        case "ArrowDown": e.preventDefault(); setVolume(v => { const n = Math.max(0, v - 0.1); video.volume = n; setIsMuted(n === 0); return n; }); break;
        case "f": case "F": e.preventDefault(); toggleFullscreen(); break;
        case "m": case "M": e.preventDefault(); video.muted = !video.muted; setIsMuted(video.muted); break;
        case ">": e.preventDefault(); skip(10); break;
        case "<": e.preventDefault(); skip(-10); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, skip]);

  const handleContainerClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) skip(-10);
    else skip(10);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) { videoRef.current.volume = val; setIsMuted(val === 0); }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) videoRef.current.currentTime = time;
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) { await containerRef.current.requestFullscreen(); setIsFullscreen(true); }
    else { await document.exitFullscreen(); setIsFullscreen(false); }
  };

  const changeSpeed = (rate: number) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const changeQuality = (level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setCurrentQuality(level === -1 ? "Auto" : hlsRef.current.levels[level]?.height + "p");
    }
    setShowQualityMenu(false);
  };

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) { setShowControls(false); setShowSpeedMenu(false); setShowQualityMenu(false); }
    }, 3000);
  }, [isPlaying]);

  useEffect(() => { return () => { if (controlsTimeout.current) clearTimeout(controlsTimeout.current); }; }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hlsLevels = hlsRef.current?.levels || [];

  return (
    <div
      ref={containerRef}
      className={cn("relative bg-black overflow-hidden group select-none", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onDoubleClick={handleContainerClick}
      tabIndex={0}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 border-2 border-wado-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Video yükleniyor...</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={() => { if (videoRef.current) setCurrentTime(videoRef.current.currentTime); }}
        onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
        onEnded={() => { setIsPlaying(false); onEnded?.(); }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onProgress={() => {
          if (!videoRef.current?.buffered.length) return;
          const end = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
          setBufferProgress((end / duration) * 100);
        }}
        playsInline
      />

      <AnimatePresence>
        {skipIndicator && (
          <motion.div
            key="skip"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <div className={cn(
              "flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-6 py-3",
              skipIndicator.dir === "forward" ? "text-wado-400" : "text-blue-400"
            )}>
              {skipIndicator.dir === "backward" && <Rewind className="h-6 w-6" />}
              <span className="text-2xl font-bold">{skipIndicator.sec}s</span>
              {skipIndicator.dir === "forward" && <FastForward className="h-6 w-6" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!isPlaying || showControls) && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black via-transparent to-black/30 z-10"
          >
            <div className="p-6 flex items-start justify-between">
              <div>
                {title && <h3 className="text-lg font-medium text-white drop-shadow-lg">{title}</h3>}
                <p className="text-xs text-white/60 mt-1">{formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}</p>
              </div>
              <div className="hidden md:flex items-center gap-3 text-[10px] text-white/40 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                <span><kbd className="text-white/70">Space</kbd> Oynat</span>
                <span><kbd className="text-white/70">←→</kbd> 5s</span>
                <span><kbd className="text-white/70">&lt;&gt;</kbd> 10s</span>
                <span><kbd className="text-white/70">F</kbd> Tam</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 md:gap-6">
              {onPrevious && (
                <button onClick={onPrevious} className="p-2 text-white/80 hover:text-white transition-colors">
                  <SkipBack className="md:h-8 md:w-8 h-6 w-6" />
                </button>
              )}
              <button onClick={() => skip(-5)} className="p-2 text-white/60 hover:text-white transition-colors hidden md:block">
                <Rewind className="h-6 w-6" />
              </button>
              <button onClick={togglePlay} className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-wado-600/90 flex items-center justify-center hover:bg-wado-600 transition-all shadow-2xl hover:scale-105 active:scale-95">
                {isPlaying ? <Pause className="md:h-8 md:w-8 h-6 w-6 text-white" /> : <Play className="md:h-8 md:w-8 h-6 w-6 text-white fill-white ml-0.5 md:ml-1" />}
              </button>
              <button onClick={() => skip(5)} className="p-2 text-white/60 hover:text-white transition-colors hidden md:block">
                <FastForward className="h-6 w-6" />
              </button>
              {onNext && (
                <button onClick={onNext} className="p-2 text-white/80 hover:text-white transition-colors">
                  <SkipForward className="md:h-8 md:w-8 h-6 w-6" />
                </button>
              )}
            </div>

            <div className="p-4 space-y-2">
              <div
                className="relative h-1.5 group/progress cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  const time = pct * duration;
                  if (videoRef.current) videoRef.current.currentTime = time;
                }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white/30 rounded-full" style={{ width: `${bufferProgress}%` }} />
                </div>
                <div className="h-full bg-wado-500 rounded-full relative transition-all duration-100" style={{ width: `${progress}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-wado-500 opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                  <button onClick={togglePlay} className="text-white hover:text-wado-500 transition-colors">
                    {isPlaying ? <Pause className="md:h-5 md:w-5 h-4 w-4" /> : <Play className="md:h-5 md:w-5 h-4 w-4" />}
                  </button>
                  <button onClick={() => skip(-5)} className="text-white/60 hover:text-white transition-colors md:hidden">
                    <Rewind className="h-4 w-4" />
                  </button>
                  <button onClick={() => skip(5)} className="text-white/60 hover:text-white transition-colors md:hidden">
                    <FastForward className="h-4 w-4" />
                  </button>
                  <button onClick={toggleMute} className="text-white hover:text-wado-500 transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="md:h-5 md:w-5 h-4 w-4" /> : <Volume2 className="md:h-5 md:w-5 h-4 w-4" />}
                  </button>
                  <input type="range" min={0} max={1} step={0.05} value={volume} onChange={handleVolumeChange} className="w-16 md:w-20 h-1 accent-wado-500 hidden md:block" />
                  <span className="text-xs md:text-sm text-white/80 font-mono min-w-[100px]">
                    {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
                  </span>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <div className="relative">
                    <button onClick={() => { setShowSpeedMenu(!showSpeedMenu); setShowQualityMenu(false); }} className="text-white/80 hover:text-white transition-colors text-xs md:text-sm font-medium px-2 py-1 rounded bg-white/5 hover:bg-white/10">
                      {playbackRate}x
                    </button>
                    <AnimatePresence>
                      {showSpeedMenu && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full right-0 mb-2 w-24 bg-black/95 backdrop-blur-xl rounded-lg border border-white/10 p-1 shadow-2xl"
                        >
                          {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                            <button key={rate} onClick={() => changeSpeed(rate)}
                              className={cn("w-full px-3 py-1.5 text-xs text-left rounded-md transition-colors", playbackRate === rate ? "bg-wado-600 text-white" : "text-white/80 hover:bg-white/10")}
                            >{rate}x</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative">
                    <button onClick={() => { setShowQualityMenu(!showQualityMenu); setShowSpeedMenu(false); }} className="text-white/80 hover:text-white transition-colors text-xs md:text-sm font-medium px-2 py-1 rounded bg-white/5 hover:bg-white/10">
                      {currentQuality}
                    </button>
                    <AnimatePresence>
                      {showQualityMenu && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full right-0 mb-2 w-32 bg-black/95 backdrop-blur-xl rounded-lg border border-white/10 p-1 shadow-2xl"
                        >
                          <button onClick={() => changeQuality(-1)}
                            className={cn("w-full px-3 py-1.5 text-xs text-left rounded-md transition-colors", currentQuality === "Auto" ? "bg-wado-600 text-white" : "text-white/80 hover:bg-white/10")}
                          >Otomatik</button>
                          {hlsLevels.map((l, i) => (
                            <button key={i} onClick={() => changeQuality(i)}
                              className={cn("w-full px-3 py-1.5 text-xs text-left rounded-md transition-colors", currentQuality === l.height + "p" ? "bg-wado-600 text-white" : "text-white/80 hover:bg-white/10")}
                            >{l.height}p {l.bitrate ? `(${(l.bitrate / 1000000).toFixed(1)}Mbps)` : ""}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition-colors">
                    {isFullscreen ? <Minimize className="md:h-5 md:w-5 h-4 w-4" /> : <Maximize className="md:h-5 md:w-5 h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isPlaying && !loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-wado-600/80 flex items-center justify-center backdrop-blur-sm">
            <Play className="h-8 w-8 md:h-10 md:w-10 text-white fill-white ml-0.5 md:ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
