export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
  isActive: boolean;
  language: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  videoUrl: string | null;
  year: number | null;
  imdbRating: number | null;
  contentRating: string | null;
  isActive: boolean;
  featured: boolean;
  categoryId: string | null;
  category?: Category | null;
  episodes?: Episode[];
  actors?: Actor[];
  createdAt: string;
}

export interface Episode {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  episodeNumber: number;
  seasonNumber: number;
  duration: number | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  isActive: boolean;
  seriesId: string;
  series?: Series;
  createdAt: string;
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  description: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  videoUrl: string | null;
  duration: number | null;
  year: number | null;
  imdbRating: number | null;
  contentRating: string | null;
  isActive: boolean;
  featured: boolean;
  categoryId: string | null;
  category?: Category | null;
  actors?: Actor[];
  createdAt: string;
}

export interface Actor {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  photoUrl: string | null;
  birthDate: string | null;
  birthPlace: string | null;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  videoUrl: string | null;
  duration: number | null;
  isActive: boolean;
  live: boolean;
  liveUrl: string | null;
  schedule: string | null;
  categoryId: string | null;
  category?: Category | null;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  userId: string;
  seriesId: string | null;
  movieId: string | null;
  programId: string | null;
  createdAt: string;
}

export interface WatchHistory {
  id: string;
  progress: number;
  completed: boolean;
  series?: Series | null;
  episode?: Episode | null;
  movie?: Movie | null;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  series?: Series | null;
  movie?: Movie | null;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  linkUrl: string | null;
  linkText: string | null;
  order: number;
  isActive: boolean;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface LiveStream {
  id: string;
  title: string;
  description: string | null;
  streamUrl: string | null;
  thumbnailUrl: string | null;
  isLive: boolean;
  scheduledAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
}

export interface SearchResults {
  series: Series[];
  movies: Movie[];
  actors: Actor[];
  programs: Program[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
