"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Clock, Loader2, Tv, Film, User } from "lucide-react";
import { useUIStore, useSearchStore } from "@/store";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SearchOverlay() {
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const { query, setQuery, results, isSearching, setIsSearching, recentSearches, addRecentSearch } = useSearchStore();
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!debouncedQuery) {
      setIsSearching(false);
      return;
    }
    const search = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        if (data.success) {
          useSearchStore.getState().setResults(data.data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    };
    search();
  }, [debouncedQuery, setIsSearching]);

  const handleSelect = (searchTerm: string) => {
    addRecentSearch(searchTerm);
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl"
        >
          <div className="max-w-3xl mx-auto px-4 pt-20">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Dizi, film, oyuncu veya program ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-16 pl-14 pr-14 text-xl bg-transparent border-b-2 border-white/20 text-white placeholder:text-muted-foreground focus:outline-none focus:border-wado-500 transition-colors"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-8 max-h-[60vh] overflow-y-auto">
              {!query && (
                <div>
                  {recentSearches.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium text-muted-foreground">Son Aramalar</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, i) => (
                          <button
                            key={i}
                            onClick={() => setQuery(search)}
                            className="px-4 py-2 text-sm text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium text-muted-foreground">Trend Aramalar</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Popüler Diziler", "Yeni Filmler", "Canlı Yayın"].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => setQuery(item)}
                          className="px-4 py-2 text-sm text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {isSearching && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 text-wado-500 animate-spin" />
                </div>
              )}

              {!isSearching && query && (
                <div className="space-y-8">
                  {results.series.length > 0 && (
                    <Section title="Diziler" icon={Tv}>
                      {results.series.map((s) => (
                        <SearchItem
                          key={s.id}
                          href={`/dizi/${s.id}`}
                          image={s.posterUrl}
                          title={s.title}
                          subtitle={s.year?.toString()}
                          badge="Dizi"
                          onClick={() => handleSelect(s.title)}
                        />
                      ))}
                    </Section>
                  )}
                  {results.movies.length > 0 && (
                    <Section title="Filmler" icon={Film}>
                      {results.movies.map((m) => (
                        <SearchItem
                          key={m.id}
                          href={`/film/${m.id}`}
                          image={m.posterUrl}
                          title={m.title}
                          subtitle={m.year?.toString()}
                          badge="Film"
                          onClick={() => handleSelect(m.title)}
                        />
                      ))}
                    </Section>
                  )}
                  {results.actors.length > 0 && (
                    <Section title="Oyuncular" icon={User}>
                      {results.actors.map((a) => (
                        <SearchItem
                          key={a.id}
                          href={`/oyuncu/${a.id}`}
                          image={a.photoUrl}
                          title={a.name}
                          subtitle={a.birthPlace || undefined}
                          badge="Oyuncu"
                          onClick={() => handleSelect(a.name)}
                        />
                      ))}
                    </Section>
                  )}
                  {results.series.length === 0 && results.movies.length === 0 && results.actors.length === 0 && (
                    <div className="text-center py-20">
                      <p className="text-muted-foreground">"{query}" için sonuç bulunamadı</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-wado-500" />
        <h3 className="text-sm font-medium text-white">{title}</h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SearchItem({
  href,
  image,
  title,
  subtitle,
  badge,
  onClick,
}: {
  href: string;
  image: string | null | undefined;
  title: string;
  subtitle?: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
    >
      <div className="relative h-14 w-10 flex-shrink-0 rounded overflow-hidden">
        <Image
          src={image || "/images/placeholder-poster.jpg"}
          alt={title}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-wado-400 transition-colors">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      {badge && <Badge variant="outline" className="text-[10px]">{badge}</Badge>}
    </Link>
  );
}
