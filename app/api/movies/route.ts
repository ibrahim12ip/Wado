import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = { isActive: true };
    if (category) where.categoryId = category;
    if (featured === "true") where.featured = true;

    const [data, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        include: { category: true, actors: { include: { actor: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.movie.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Filmler yüklenirken hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const movie = await prisma.movie.create({
      data: {
        title: body.title,
        slug: `${slugify(body.title)}-${Date.now()}`,
        description: body.description,
        posterUrl: body.posterUrl,
        backdropUrl: body.backdropUrl,
        trailerUrl: body.trailerUrl,
        videoUrl: body.videoUrl,
        hlsUrl: body.hlsUrl,
        duration: body.duration ? parseInt(body.duration) : null,
        year: body.year ? parseInt(body.year) : null,
        imdbRating: body.imdbRating ? parseFloat(body.imdbRating) : null,
        contentRating: body.contentRating,
        featured: body.featured || false,
        categoryId: body.categoryId || null,
      },
      include: { category: true },
    });
    return NextResponse.json({ success: true, data: movie }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Film eklenirken hata oluştu" }, { status: 500 });
  }
}
