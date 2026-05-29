import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    const body = await request.json();
    const stream = await prisma.liveStream.update({
      where: { id },
      data: {
        title: body.title, description: body.description,
        streamUrl: body.streamUrl,
        thumbnailUrl: body.thumbnailUrl,
        isLive: body.isLive ?? false,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      },
    });
    return NextResponse.json({ success: true, data: stream });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Canlı yayın güncellenirken hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    await prisma.liveStream.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Canlı yayın silindi" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Canlı yayın silinirken hata oluştu" }, { status: 500 });
  }
}
