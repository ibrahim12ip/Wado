import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Tüm alanları doldurun" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Bu email zaten kayıtlı" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    return NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
      message: "Kayıt başarılı",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kayıt olurken hata oluştu" }, { status: 500 });
  }
}
