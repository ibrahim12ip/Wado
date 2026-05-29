import { create } from "zustand";
import type { Series, Movie, Actor, Category } from "@/types";

interface UIState {
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}));

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  quality: string;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setFullscreen: (fullscreen: boolean) => void;
  setQuality: (quality: string) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
  quality: "auto",
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setMuted: (muted) => set({ isMuted: muted }),
  setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  setQuality: (quality) => set({ quality }),
}));

interface ContentState {
  series: Series[];
  movies: Movie[];
  trending: (Series | Movie)[];
  categories: Category[];
  featuredSeries: Series[];
  featuredMovies: Movie[];
  continueWatching: (Series | Movie)[];
  loading: boolean;
  setSeries: (series: Series[]) => void;
  setMovies: (movies: Movie[]) => void;
  setTrending: (trending: (Series | Movie)[]) => void;
  setCategories: (categories: Category[]) => void;
  setFeaturedSeries: (series: Series[]) => void;
  setFeaturedMovies: (movies: Movie[]) => void;
  setContinueWatching: (items: (Series | Movie)[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  series: [],
  movies: [],
  trending: [],
  categories: [],
  featuredSeries: [],
  featuredMovies: [],
  continueWatching: [],
  loading: false,
  setSeries: (series) => set({ series }),
  setMovies: (movies) => set({ movies }),
  setTrending: (trending) => set({ trending }),
  setCategories: (categories) => set({ categories }),
  setFeaturedSeries: (series) => set({ featuredSeries: series }),
  setFeaturedMovies: (movies) => set({ featuredMovies: movies }),
  setContinueWatching: (items) => set({ continueWatching: items }),
  setLoading: (loading) => set({ loading }),
}));

interface SearchState {
  query: string;
  results: {
    series: Series[];
    movies: Movie[];
    actors: Actor[];
  };
  isSearching: boolean;
  recentSearches: string[];
  setQuery: (query: string) => void;
  setResults: (results: { series: Series[]; movies: Movie[]; actors: Actor[] }) => void;
  setIsSearching: (searching: boolean) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  results: { series: [], movies: [], actors: [] },
  isSearching: false,
  recentSearches: [],
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  addRecentSearch: (query) =>
    set((state) => ({
      recentSearches: [query, ...state.recentSearches.filter((s) => s !== query)].slice(
        0,
        10
      ),
    })),
  clearRecentSearches: () => set({ recentSearches: [] }),
}));
