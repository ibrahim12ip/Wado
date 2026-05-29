import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const series = await prisma.series.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        episodes: { orderBy: [{ seasonNumber: "asc" }, { episodeNumber: "asc" }] },
        actors: {
          include: { actor: true },
          orderBy: { order: "asc" },
        },
        comments: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!series) {
      return NextResponse.json(
        { success: false, error: "Dizi bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: series });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Dizi yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const series = await prisma.series.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        posterUrl: body.posterUrl,
        backdropUrl: body.backdropUrl,
        trailerUrl: body.trailerUrl,
        year: body.year ? parseInt(body.year) : null,
        imdbRating: body.imdbRating ? parseFloat(body.imdbRating) : null,
        contentRating: body.contentRating,
        featured: body.featured,
        isActive: body.isActive,
        categoryId: body.categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: series });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Dizi güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.series.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Dizi silindi" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Dizi silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
