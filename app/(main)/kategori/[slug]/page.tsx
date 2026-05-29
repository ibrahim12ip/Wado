"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ContentCard } from "@/components/shared/content-card";
import { ContentCardSkeleton } from "@/components/shared/skeleton";
import type { Category, Series, Movie } from "@/types";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [series, setSeries] = useState<Series[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, seriesRes, moviesRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/series"),
          fetch("/api/movies"),
        ]);

        const categoriesData = await categoriesRes.json();
        const seriesData = await seriesRes.json();
        const moviesData = await moviesRes.json();

        const cat = categoriesData.data?.find(
          (c: Category) => c.slug === slug
        );
        setCategory(cat || null);

        if (cat) {
          if (seriesData.success) {
            setSeries(
              seriesData.data.filter(
                (s: Series) => s.categoryId === cat.id
              )
            );
          }
          if (moviesData.success) {
            setMovies(
              moviesData.data.filter(
                (m: Movie) => m.categoryId === cat.id
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
  }, [slug]);

  const hasContent = series.length > 0 || movies.length > 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {loading ? (
          <>
            <div className="h-10 w-64 bg-white/5 animate-pulse rounded-lg mb-2" />
            <div className="h-5 w-96 bg-white/5 animate-pulse rounded-lg mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <ContentCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : !category ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <p className="text-muted-foreground text-lg">
              Kategori bulunamadı
            </p>
          </div>
        ) : !hasContent ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Kategori: {category.name}
            </h1>
            <p className="text-muted-foreground">
              Bu kategoride henüz içerik bulunmuyor
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Kategori: {category.name}
            </h1>
            {category.description && (
              <p className="text-muted-foreground mb-8">
                {category.description}
              </p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-10"
            >
              {series.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Diziler
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
                        categoryName={category.name}
                      />
                    ))}
                  </div>
                </section>
              )}

              {movies.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Filmler
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
                        categoryName={category.name}
                      />
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
