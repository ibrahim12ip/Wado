"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentCard } from "@/components/shared/content-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContentRowProps {
  title: string;
  link?: string;
  items: Array<{
    id: string;
    title: string;
    posterUrl: string | null;
    imdbRating?: number | null;
    year?: number | null;
    categoryName?: string;
  }>;
  type: "series" | "movie" | "program";
  className?: string;
}

export function ContentRow({ title, link, items, type, className }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -600 : 600;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className={cn("py-8 relative group", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-wado-500 rounded-full" />
            <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          </div>
          {link && (
            <Link href={link}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                Tümünü Gör
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-start pl-2"
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-4 container mx-auto hide-scrollbar"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ContentCard {...item} type={type} />
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-2"
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </button>
      </div>
    </section>
  );
}
