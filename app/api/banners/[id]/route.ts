import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    const body = await request.json();
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: body.title, description: body.description,
        imageUrl: body.imageUrl, videoUrl: body.videoUrl,
        linkUrl: body.linkUrl, linkText: body.linkText,
        order: body.order || 0,
      },
    });
    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Banner güncellenirken hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Banner silindi" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Banner silinirken hata oluştu" }, { status: 500 });
  }
}
