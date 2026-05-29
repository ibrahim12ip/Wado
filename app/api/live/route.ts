import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/auth";

export async function GET() {
  try {
    const liveStreams = await prisma.liveStream.findMany({
      where: { isLive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: liveStreams });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Canlı yayınlar yüklenirken hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const body = await request.json();
    const stream = await prisma.liveStream.create({
      data: {
        title: body.title,
        description: body.description,
        streamUrl: body.streamUrl,
        hlsUrl: body.hlsUrl,
        thumbnailUrl: body.thumbnailUrl,
        isLive: body.isLive || false,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      },
    });
    return NextResponse.json({ success: true, data: stream }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Canlı yayın eklenirken hata oluştu" }, { status: 500 });
  }
}
