import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Oturum açmanız gerekiyor" }, { status: 401 });

    const body = await request.json();
    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        userId: user.id,
        seriesId: body.seriesId || null,
        movieId: body.movieId || null,
        programId: body.programId || null,
      },
      include: { user: true },
    });

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Yorum eklenirken hata oluştu" }, { status: 500 });
  }
}
