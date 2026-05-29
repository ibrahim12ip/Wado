import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { adminGuard } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const live = searchParams.get("live");
    const where: Record<string, unknown> = { isActive: true };
    if (live === "true") where.live = true;

    const programs = await prisma.program.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: programs });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Programlar yüklenirken hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const body = await request.json();
    const program = await prisma.program.create({
      data: {
        title: body.title,
        slug: `${slugify(body.title)}-${Date.now()}`,
        description: body.description,
        posterUrl: body.posterUrl,
        backdropUrl: body.backdropUrl,
        videoUrl: body.videoUrl,
        hlsUrl: body.hlsUrl,
        duration: body.duration ? parseInt(body.duration) : null,
        live: body.live || false,
        liveUrl: body.liveUrl,
        schedule: body.schedule,
        categoryId: body.categoryId || null,
      },
      include: { category: true },
    });
    return NextResponse.json({ success: true, data: program }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Program eklenirken hata oluştu" }, { status: 500 });
  }
}
