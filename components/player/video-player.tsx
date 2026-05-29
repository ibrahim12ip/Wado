"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Settings,
  Subtitles,
  List,
  ChevronRight,
} from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import { usePlayerStore } from "@/store";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  subtitles?: Array<{ label: string; src: string; srclang: string }>;
  qualities?: Array<{ label: string; src: string }>;
  onNext?: () => void;
  onPrevious?: () => void;
  onEnded?: () => void;
  className?: string;
}

export function VideoPlayer({
  src,
  poster,
  title,
  subtitles,
  qualities,
  onNext,
  onPrevious,
  onEnded,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState("auto");
  const [bufferProgress, setBufferProgress] = useState(0);
  const controlsTimeout = useRef<NodeJS.Timeout>();

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
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
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={cn("relative bg-black overflow-hidden group", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => { setIsPlaying(false); onEnded?.(); }}
        onProgress={() => {
          if (!videoRef.current?.buffered.length) return;
          const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
          setBufferProgress((bufferedEnd / duration) * 100);
        }}
        playsInline
      />

      <AnimatePresence>
        {(!isPlaying || showControls) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/40"
          >
            {title && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-white">{title}</h3>
              </div>
            )}

            <div className="flex items-center justify-center gap-6">
              {onPrevious && (
                <button onClick={onPrevious} className="p-2 text-white/80 hover:text-white transition-colors">
                  <SkipBack className="h-8 w-8" />
                </button>
              )}
              <button
                onClick={togglePlay}
                className="h-16 w-16 rounded-full bg-wado-600/90 flex items-center justify-center hover:bg-wado-600 transition-colors shadow-2xl"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white fill-white ml-1" />
                )}
              </button>
              {onNext && (
                <button onClick={onNext} className="p-2 text-white/80 hover:text-white transition-colors">
                  <SkipForward className="h-8 w-8" />
                </button>
              )}
            </div>

            <div className="p-4 space-y-2">
              <div className="relative h-1 group cursor-pointer">
                <div className="absolute inset-0 bg-white/20 rounded-full">
                  <div
                    className="h-full bg-white/40 rounded-full"
                    style={{ width: `${bufferProgress}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className="h-full bg-wado-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-wado-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-wado-500 transition-colors"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>

                  <button onClick={toggleMute} className="text-white hover:text-wado-500 transition-colors">
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 accent-wado-500"
                  />

                  <span className="text-sm text-white/80">
                    {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {subtitles && subtitles.length > 0 && (
                    <button className="text-white/80 hover:text-white transition-colors">
                      <Subtitles className="h-5 w-5" />
                    </button>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setShowQualityMenu(!showQualityMenu)}
                      className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                    >
                      {currentQuality === "auto" ? "Otomatik" : currentQuality}
                    </button>
                    <AnimatePresence>
                      {showQualityMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full right-0 mb-2 w-40 bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 p-1"
                        >
                          {["auto", "1080p", "720p", "480p", "360p"].map((q) => (
                            <button
                              key={q}
                              onClick={() => { setCurrentQuality(q); setShowQualityMenu(false); }}
                              className={cn(
                                "w-full px-3 py-2 text-sm text-left rounded-md transition-colors",
                                currentQuality === q ? "bg-wado-600 text-white" : "text-white/80 hover:bg-white/10"
                              )}
                            >
                              {q === "auto" ? "Otomatik" : q}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={togglePlay}
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-wado-600/80 flex items-center justify-center transition-all duration-300",
          isPlaying && !showControls ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        {isPlaying ? (
          <Pause className="h-10 w-10 text-white" />
        ) : (
          <Play className="h-10 w-10 text-white fill-white ml-1" />
        )}
      </button>
    </div>
  );
}
