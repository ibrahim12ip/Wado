import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        category: true,
        actors: { include: { actor: true }, orderBy: { order: "asc" } },
        comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
      },
    });
    if (!movie) return NextResponse.json({ success: false, error: "Film bulunamadı" }, { status: 404 });
    return NextResponse.json({ success: true, data: movie });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Film yüklenirken hata oluştu" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    const body = await request.json();
    if (body.actorIds) {
      await prisma.movieActor.deleteMany({ where: { movieId: id } });
      await prisma.movieActor.createMany({
        data: (body.actorIds as string[]).map((actorId: string, idx: number) => ({ movieId: id, actorId, order: idx })),
      });
    }
    const movie = await prisma.movie.update({
      where: { id },
      data: {
        title: body.title, description: body.description, posterUrl: body.posterUrl,
        backdropUrl: body.backdropUrl, trailerUrl: body.trailerUrl, videoUrl: body.videoUrl,
        duration: body.duration ? parseInt(body.duration) : null,
        year: body.year ? parseInt(body.year) : null,
        imdbRating: body.imdbRating ? parseFloat(body.imdbRating) : null,
        contentRating: body.contentRating, featured: body.featured, isActive: body.isActive,
        categoryId: body.categoryId,
      },
      include: { category: true, actors: { include: { actor: true } } },
    });
    return NextResponse.json({ success: true, data: movie });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Film güncellenirken hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    await prisma.movie.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Film silindi" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Film silinirken hata oluştu" }, { status: 500 });
  }
}
