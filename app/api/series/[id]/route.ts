import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const series = await prisma.series.findUnique({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    const body = await request.json();
    if (body.actorIds) {
      await prisma.seriesActor.deleteMany({ where: { seriesId: id } });
      await prisma.seriesActor.createMany({
        data: (body.actorIds as string[]).map((actorId: string, idx: number) => ({ seriesId: id, actorId, order: idx })),
      });
    }
    const series = await prisma.series.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        posterUrl: body.posterUrl,
        backdropUrl: body.backdropUrl,
        trailerUrl: body.trailerUrl,
        videoUrl: body.videoUrl,
        hlsUrl: body.hlsUrl,
        year: body.year ? parseInt(body.year) : null,
        imdbRating: body.imdbRating ? parseFloat(body.imdbRating) : null,
        contentRating: body.contentRating,
        featured: body.featured,
        isActive: body.isActive,
        categoryId: body.categoryId,
      },
      include: { category: true, actors: { include: { actor: true } } },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    await prisma.series.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Dizi silindi" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Dizi silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
