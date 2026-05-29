import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Haberler yüklenirken hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newsItem = await prisma.news.create({
      data: {
        title: body.title,
        slug: `${slugify(body.title)}-${Date.now()}`,
        description: body.description,
        content: body.content,
        imageUrl: body.imageUrl,
      },
    });
    return NextResponse.json({ success: true, data: newsItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Haber eklenirken hata oluştu" }, { status: 500 });
  }
}
