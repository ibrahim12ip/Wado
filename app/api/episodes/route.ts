import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { adminGuard } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get("seriesId");
    const where: Record<string, unknown> = { isActive: true };
    if (seriesId) where.seriesId = seriesId;

    const episodes = await prisma.episode.findMany({
      where,
      include: { series: true },
      orderBy: [{ seasonNumber: "asc" }, { episodeNumber: "asc" }],
    });

    return NextResponse.json({ success: true, data: episodes });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Bölümler yüklenirken hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const body = await request.json();
    const episode = await prisma.episode.create({
      data: {
        title: body.title,
        slug: slugify(body.title),
        description: body.description,
        episodeNumber: parseInt(body.episodeNumber),
        seasonNumber: parseInt(body.seasonNumber) || 1,
        duration: body.duration ? parseInt(body.duration) : null,
        thumbnailUrl: body.thumbnailUrl,
        videoUrl: body.videoUrl,
        seriesId: body.seriesId,
      },
      include: { series: true },
    });
    return NextResponse.json({ success: true, data: episode }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Bölüm eklenirken hata oluştu" }, { status: 500 });
  }
}
