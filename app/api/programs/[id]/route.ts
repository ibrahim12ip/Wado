import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    const body = await request.json();
    const program = await prisma.program.update({
      where: { id },
      data: {
        title: body.title, description: body.description,
        posterUrl: body.posterUrl, backdropUrl: body.backdropUrl,
        videoUrl: body.videoUrl,
        duration: body.duration ? parseInt(body.duration) : null,
        live: body.live ?? false, liveUrl: body.liveUrl,
        schedule: body.schedule, categoryId: body.categoryId || null,
      },
    });
    return NextResponse.json({ success: true, data: program });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Program güncellenirken hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    await prisma.program.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Program silindi" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Program silinirken hata oluştu" }, { status: 500 });
  }
}
