import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wado.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/diziler`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/filmler`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/programlar`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/canli-yayin`, lastModified: new Date(), changeFrequency: "always" as const, priority: 0.7 },
    { url: `${baseUrl}/haberler`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.6 },
  ];

  let series: { id: string; updatedAt: string }[] = [];
  let movies: { id: string; updatedAt: string }[] = [];

  try {
    const [seriesRes, moviesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/series`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/movies`).then(r => r.json()),
    ]);
    if (seriesRes.success) series = seriesRes.data;
    if (moviesRes.success) movies = moviesRes.data;
  } catch {
    // fallback if API is not available during build
  }

  const seriesPages = series.map((s) => ({
    url: `${baseUrl}/dizi/${s.id}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const moviePages = movies.map((m) => ({
    url: `${baseUrl}/film/${m.id}`,
    lastModified: new Date(m.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...seriesPages, ...moviePages];
}
