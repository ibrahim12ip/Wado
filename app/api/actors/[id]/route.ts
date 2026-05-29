import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    const body = await request.json();
    const actor = await prisma.actor.update({
      where: { id },
      data: {
        name: body.name,
        bio: body.bio,
        photoUrl: body.photoUrl,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        birthPlace: body.birthPlace,
      },
    });
    return NextResponse.json({ success: true, data: actor });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Oyuncu güncellenirken hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await adminGuard();
    if (error) return error;
    const { id } = await params;
    await prisma.actor.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Oyuncu silindi" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Oyuncu silinirken hata oluştu" }, { status: 500 });
  }
}
