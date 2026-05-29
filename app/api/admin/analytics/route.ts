import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 403 });
    }

    const [
      totalUsers, totalSeries, totalMovies, totalEpisodes,
      totalActors, totalPrograms, totalComments, recentSeries,
      recentMovies, recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.series.count(),
      prisma.movie.count(),
      prisma.episode.count(),
      prisma.actor.count(),
      prisma.program.count(),
      prisma.comment.count(),
      prisma.series.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { category: true } }),
      prisma.movie.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { category: true } }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        counts: { users: totalUsers, series: totalSeries, movies: totalMovies, episodes: totalEpisodes, actors: totalActors, programs: totalPrograms, comments: totalComments },
        recentSeries, recentMovies, recentUsers,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Analytics yüklenirken hata oluştu" }, { status: 500 });
  }
}
