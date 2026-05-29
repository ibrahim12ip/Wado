"use client";

import { useEffect, useState } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { ContentRow } from "@/components/home/content-row";
import { ContentCard } from "@/components/shared/content-card";
import Skeleton from "@/components/shared/skeleton";
import {
  Tv,
  Film,
  Flame,
  Sparkles,
  Star,
  Radio,
  PlaySquare,
  Users,
} from "lucide-react";
import type { Series, Movie, Program, Actor } from "@/types";

function HomeSectionSkeleton() {
  return (
    <div className="py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="flex gap-3 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[180px] space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [trending, setTrending] = useState<Series[]>([]);
  const [newSeries, setNewSeries] = useState<Series[]>([]);
  const [popularPrograms, setPopularPrograms] = useState<Program[]>([]);
  const [editorPicks, setEditorPicks] = useState<Series[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [seriesRes, moviesRes, programsRes, actorsRes] = await Promise.all([
          fetch("/api/series"),
          fetch("/api/movies"),
          fetch("/api/programs"),
          fetch("/api/actors"),
        ]);

        const series = await seriesRes.json();
        const movies = await moviesRes.json();
        const programs = await programsRes.json();
        const actors = await actorsRes.json();

        if (series.success) {
          setTrending(series.data.slice(0, 10));
          setNewSeries(series.data.slice(0, 10));
          setEditorPicks(series.data.filter((s: Series) => s.featured).slice(0, 10));
        }
        if (movies.success) setMovies(movies.data.slice(0, 10));
        if (programs.success) setPopularPrograms(programs.data.slice(0, 10));
        if (actors.success) setActors(actors.data.slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton className="h-[85vh] w-full" />
        <div className="container mx-auto px-4">
          {[...Array(5)].map((_, i) => (
            <HomeSectionSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSlider />

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <ContentRow
          title="Trend Diziler"
          link="/diziler"
          items={trending.map((s) => ({
            id: s.id,
            title: s.title,
            posterUrl: s.posterUrl,
            imdbRating: s.imdbRating,
            year: s.year,
            categoryName: s.category?.name,
          }))}
          type="series"
        />

        <ContentRow
          title="Yeni Eklenen Filmler"
          link="/filmler"
          items={movies.map((m) => ({
            id: m.id,
            title: m.title,
            posterUrl: m.posterUrl,
            imdbRating: m.imdbRating,
            year: m.year,
            categoryName: m.category?.name,
          }))}
          type="movie"
        />

        <ContentRow
          title="Popüler Programlar"
          link="/programlar"
          items={popularPrograms.map((p) => ({
            id: p.id,
            title: p.title,
            posterUrl: p.posterUrl,
            categoryName: p.category?.name,
          }))}
          type="program"
        />

        <ContentRow
          title="Editörün Seçtikleri"
          link="/diziler"
          items={editorPicks.map((s) => ({
            id: s.id,
            title: s.title,
            posterUrl: s.posterUrl,
            imdbRating: s.imdbRating,
            year: s.year,
            categoryName: s.category?.name,
          }))}
          type="series"
        />

        <ContentRow
          title="Yeni Eklenen Diziler"
          link="/diziler"
          items={newSeries.map((s) => ({
            id: s.id,
            title: s.title,
            posterUrl: s.posterUrl,
            imdbRating: s.imdbRating,
            year: s.year,
            categoryName: s.category?.name,
          }))}
          type="series"
        />
      </div>

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-wado-600/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wado-600/20 border border-wado-500/30 text-wado-400 text-sm mb-6">
            <Radio className="h-4 w-4" />
            Canlı Yayında
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Canlı Yayınları Kaçırma
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            7/24 kesintisiz canlı yayın akışı ile en sevdiğin programları takip et.
          </p>
          <a
            href="/canli-yayin"
            className="inline-flex items-center gap-2 px-8 py-3 bg-wado-600 hover:bg-wado-700 text-white rounded-full font-medium transition-all shadow-xl shadow-wado-600/30"
          >
            <Radio className="h-5 w-5" />
            İzlemeye Başla
          </a>
        </div>
      </section>

      <section className="py-12 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-6 w-6 text-wado-500" />
            <h2 className="text-2xl font-bold text-white">Popüler Oyuncular</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {actors.map((actor) => (
              <a
                key={actor.id}
                href={`/oyuncu/${actor.id}`}
                className="group text-center"
              >
                <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden border-2 border-white/10 group-hover:border-wado-500 transition-all">
                  <img
                    src={actor.photoUrl || "/images/placeholder-actor.svg"}
                    alt={actor.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-white group-hover:text-wado-400 transition-colors">
                  {actor.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <PlaySquare className="h-6 w-6 text-wado-500" />
            <h2 className="text-2xl font-bold text-white">Fragmanlar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...trending.slice(0, 4)].map((s) => (
              <div key={s.id} className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
                <img
                  src={s.backdropUrl || s.posterUrl || "/images/placeholder-poster.jpg"}
                  alt={s.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-all">
                  <div className="h-14 w-14 rounded-full bg-wado-600/90 flex items-center justify-center shadow-xl">
                    <PlaySquare className="h-6 w-6 text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 card-gradient">
                  <p className="text-white font-medium">{s.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
