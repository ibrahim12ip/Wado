import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    const body = await request.json();
    const episode = await prisma.episode.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        episodeNumber: parseInt(body.episodeNumber),
        seasonNumber: parseInt(body.seasonNumber) || 1,
        duration: body.duration ? parseInt(body.duration) : null,
        thumbnailUrl: body.thumbnailUrl,
        videoUrl: body.videoUrl,
        seriesId: body.seriesId,
      },
    });
    return NextResponse.json({ success: true, data: episode });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Bölüm güncellenirken hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    await prisma.episode.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Bölüm silindi" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Bölüm silinirken hata oluştu" }, { status: 500 });
  }
}
