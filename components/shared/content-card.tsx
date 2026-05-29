"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  id: string;
  title: string;
  posterUrl: string | null;
  imdbRating?: number | null;
  year?: number | null;
  type: "series" | "movie" | "program";
  categoryName?: string;
  className?: string;
}

export function ContentCard({
  id,
  title,
  posterUrl,
  imdbRating,
  year,
  type,
  categoryName,
  className,
}: ContentCardProps) {
  const href = type === "series" ? `/dizi/${id}` : type === "movie" ? `/film/${id}` : `/programlar#${id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("group relative flex-shrink-0 w-[180px] md:w-[200px]", className)}
    >
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <Image
            src={posterUrl || "/images/placeholder-poster.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 180px, 200px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="h-14 w-14 rounded-full bg-wado-600/90 flex items-center justify-center shadow-xl shadow-wado-600/40">
              <Play className="h-6 w-6 text-white fill-white ml-0.5" />
            </div>
          </div>
          <div className="absolute top-2 left-2 flex gap-1.5">
            {imdbRating && (
              <Badge variant="rating" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-500" />
                {imdbRating.toFixed(1)}
              </Badge>
            )}
            {year && <Badge variant="outline">{year}</Badge>}
          </div>
          {type === "series" && (
            <div className="absolute top-2 right-2">
              <Badge variant="hd">HD</Badge>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="mt-2.5 space-y-1">
          <h3 className="text-sm font-medium text-white truncate group-hover:text-wado-400 transition-colors">
            {title}
          </h3>
          {categoryName && (
            <p className="text-xs text-muted-foreground truncate">{categoryName}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export function ContentCardRow({
  items,
  title,
  type,
}: {
  items: ContentCardProps[];
  title?: string;
  type: "series" | "movie" | "program";
}) {
  return (
    <section className="py-8">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <Link
            href={`/${type === "series" ? "diziler" : type === "movie" ? "filmler" : "programlar"}`}
            className="text-sm text-wado-500 hover:text-wado-400 transition-colors"
          >
            Tümünü Gör
          </Link>
        </div>
      )}
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
        {items.map((item) => (
          <ContentCard key={item.id} {...item} type={type} />
        ))}
      </div>
    </section>
  );
}
