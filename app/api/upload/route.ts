import { NextRequest, NextResponse } from "next/server";
import { ensureBucket, uploadToSupabase, getPublicUrl } from "@/lib/supabase-admin";
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

    await ensureBucket();
    const filename = `${uuidv4()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await uploadToSupabase(filename, buffer, file.type || `video/${ext}`);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    const { data: urlData } = getPublicUrl(filename);
    return NextResponse.json({ success: true, data: { url: urlData.publicUrl, filename } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Dosya yüklenemedi" }, { status: 500 });
  }
}
