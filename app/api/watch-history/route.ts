import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Oturum açmanız gerekiyor" }, { status: 401 });

    const history = await prisma.watchHistory.findMany({
      where: { userId: user.id },
      include: {
        series: { include: { category: true } },
        episode: true,
        movie: { include: { category: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    return NextResponse.json({ success: false, error: "İzleme geçmişi yüklenirken hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Oturum açmanız gerekiyor" }, { status: 401 });

    const body = await request.json();
    const where: Record<string, unknown> = { userId: user.id };
    if (body.seriesId) where.seriesId = body.seriesId;
    if (body.episodeId) where.episodeId = body.episodeId;
    if (body.movieId) where.movieId = body.movieId;

    const existing = await prisma.watchHistory.findFirst({ where });

    if (existing) {
      const updated = await prisma.watchHistory.update({
        where: { id: existing.id },
        data: { progress: body.progress, completed: body.completed || false },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const history = await prisma.watchHistory.create({
      data: {
        userId: user.id,
        progress: body.progress || 0,
        completed: body.completed || false,
        seriesId: body.seriesId || null,
        episodeId: body.episodeId || null,
        movieId: body.movieId || null,
      },
    });

    return NextResponse.json({ success: true, data: history }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "İzleme geçmişi güncellenirken hata oluştu" }, { status: 500 });
  }
}
