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
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { isActive: true };
    if (category) where.categoryId = category;
    if (featured === "true") where.featured = true;
    if (search) where.title = { contains: search, mode: "insensitive" };

    const [data, total] = await Promise.all([
      prisma.series.findMany({
        where,
        include: { category: true, actors: { include: { actor: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.series.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Diziler yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = slugify(body.title);

    const series = await prisma.series.create({
      data: {
        title: body.title,
        slug: `${slug}-${Date.now()}`,
        description: body.description,
        posterUrl: body.posterUrl,
        backdropUrl: body.backdropUrl,
        trailerUrl: body.trailerUrl,
        year: body.year ? parseInt(body.year) : null,
        imdbRating: body.imdbRating ? parseFloat(body.imdbRating) : null,
        contentRating: body.contentRating,
        featured: body.featured || false,
        categoryId: body.categoryId || null,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: series }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Dizi eklenirken hata oluştu" },
      { status: 500 }
    );
  }
}
