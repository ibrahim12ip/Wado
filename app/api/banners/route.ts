import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/auth";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Bannerlar yüklenirken hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const body = await request.json();
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl,
        linkUrl: body.linkUrl,
        linkText: body.linkText,
        order: body.order || 0,
      },
    });
    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Banner eklenirken hata oluştu" }, { status: 500 });
  }
}
