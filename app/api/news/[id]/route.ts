import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    const body = await request.json();
    const newsItem = await prisma.news.update({
      where: { id },
      data: { title: body.title, description: body.description, content: body.content, imageUrl: body.imageUrl },
    });
    return NextResponse.json({ success: true, data: newsItem });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Haber güncellenirken hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Haber silindi" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Haber silinirken hata oluştu" }, { status: 500 });
  }
}
