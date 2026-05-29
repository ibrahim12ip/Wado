import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ success: false, error: "Dosya gerekli" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowed = ["mp4", "webm", "mkv", "mov", "avi"];
    if (!allowed.includes(ext || ""))
      return NextResponse.json({ success: false, error: "Sadece video dosyaları (mp4, webm, mkv, mov, avi) yüklenebilir" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, data: { url, filename } });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Dosya yüklenemedi" }, { status: 500 });
  }
}
