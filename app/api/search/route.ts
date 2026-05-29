import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: { series: [], movies: [], actors: [], programs: [] } });
    }

    const [series, movies, actors, programs] = await Promise.all([
      prisma.series.findMany({
        where: { isActive: true, title: { contains: q, mode: "insensitive" } },
        take: 5,
        select: { id: true, title: true, slug: true, posterUrl: true, year: true, imdbRating: true },
      }),
      prisma.movie.findMany({
        where: { isActive: true, title: { contains: q, mode: "insensitive" } },
        take: 5,
        select: { id: true, title: true, slug: true, posterUrl: true, year: true, imdbRating: true },
      }),
      prisma.actor.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        take: 5,
        select: { id: true, name: true, slug: true, photoUrl: true, birthPlace: true },
      }),
      prisma.program.findMany({
        where: { isActive: true, title: { contains: q, mode: "insensitive" } },
        take: 5,
        select: { id: true, title: true, slug: true, posterUrl: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { series, movies, actors, programs },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Arama yapılırken hata oluştu" }, { status: 500 });
  }
}
