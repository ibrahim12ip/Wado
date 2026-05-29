import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const actors = await prisma.actor.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { series: true, movies: true } } },
    });
    return NextResponse.json({ success: true, data: actors });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Oyuncular yüklenirken hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const actor = await prisma.actor.create({
      data: {
        name: body.name,
        slug: slugify(body.name),
        bio: body.bio,
        photoUrl: body.photoUrl,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        birthPlace: body.birthPlace,
      },
    });
    return NextResponse.json({ success: true, data: actor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Oyuncu eklenirken hata oluştu" }, { status: 500 });
  }
}
