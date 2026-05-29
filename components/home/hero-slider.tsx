"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Banner } from "@/types";

const fallbackBanners: Banner[] = [
  {
    id: "1",
    title: "Sonsuzluk Savaşı",
    description: "Epik bir bilim kurgu dizisi. Sınırların ötesinde bir macera sizi bekliyor.",
    imageUrl: null,
    videoUrl: null,
    linkUrl: "/dizi/1",
    linkText: "Şimdi İzle",
    order: 0,
    isActive: true,
  },
  {
    id: "2",
    title: "Gece Yarısı Kulübü",
    description: "Gerilim dolu anlar, beklenmedik sırlar. Bu gece kulübünde her şey olabilir.",
    imageUrl: null,
    videoUrl: null,
    linkUrl: "/dizi/2",
    linkText: "Şimdi İzle",
    order: 1,
    isActive: true,
  },
  {
    id: "3",
    title: "Yeni Dünya",
    description: "Keşfedilmemiş topraklarda geçen bu görkemli hikaye sizi bekliyor.",
    imageUrl: null,
    videoUrl: null,
    linkUrl: "/film/1",
    linkText: "Şimdi İzle",
    order: 2,
    isActive: true,
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setBanners(data.data);
        }
      } catch { /* use fallback */ }
    };
    fetchBanners();
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const banner = banners[current];

  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={banner?.imageUrl || `/images/hero-${current + 1}.jpg`}
            alt={banner?.title || "Hero"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 hero-gradient" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 z-10">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl"
            >
              <Badge variant="premium" className="mb-4">Wado Exclusive</Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-shadow">
                {banner?.title}
              </h1>
              <p className="text-base md:text-lg text-gray-300 mb-8 line-clamp-3 text-shadow">
                {banner?.description}
              </p>
              <div className="flex items-center gap-4">
                <Link href={banner?.linkUrl || "#"}>
                  <Button size="xl" className="bg-wado-600 hover:bg-wado-700 shadow-xl shadow-wado-600/30">
                    <Play className="h-5 w-5 mr-2 fill-white" />
                    {banner?.linkText || "Şimdi İzle"}
                  </Button>
                </Link>
                <Link href={banner?.linkUrl || "#"}>
                  <Button size="xl" variant="outline" className="border-white/30 hover:bg-white/10">
                    <Info className="h-5 w-5 mr-2" />
                    Detaylar
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 hover:opacity-100"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 hover:opacity-100"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 right-6 md:right-16 flex items-center gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "w-10 bg-wado-500" : "w-3 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
