import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Oturum açmanız gerekiyor" }, { status: 401 });

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        series: { include: { category: true } },
        movie: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: favorites });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Favoriler yüklenirken hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Oturum açmanız gerekiyor" }, { status: 401 });

    const body = await request.json();
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        ...(body.seriesId ? { seriesId: body.seriesId } : {}),
        ...(body.movieId ? { movieId: body.movieId } : {}),
      },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, data: null, message: "Favorilerden çıkarıldı" });
    }

    const favorite = await prisma.favorite.create({
      data: { userId: user.id, seriesId: body.seriesId || null, movieId: body.movieId || null },
    });

    return NextResponse.json({ success: true, data: favorite, message: "Favorilere eklendi" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Favori eklenirken hata oluştu" }, { status: 500 });
  }
}
