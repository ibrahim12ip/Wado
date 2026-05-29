import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const useSupabase = !!(supabaseUrl && supabaseKey);

async function uploadToSupabase(file: File, filename: string) {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === "videos")) {
    await supabase.storage.createBucket("videos", {
      public: true,
      fileSizeLimit: 524288000,
      allowedMimeTypes: ["video/mp4", "video/webm", "video/x-matroska", "video/quicktime", "video/x-msvideo"],
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from("videos").upload(filename, buffer, {
    contentType: file.type || `video/${filename.split(".").pop()}`,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("videos").getPublicUrl(filename);
  return data.publicUrl;
}

async function uploadLocal(file: File, filename: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ success: false, error: "Dosya gerekli" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowed = ["mp4", "webm", "mkv", "mov", "avi"];
    if (!allowed.includes(ext || ""))
      return NextResponse.json({ success: false, error: "Sadece video dosyaları (mp4, webm, mkv, mov, avi) yüklenebilir" }, { status: 400 });

    const filename = `${uuidv4()}.${ext}`;
    const url = useSupabase ? await uploadToSupabase(file, filename) : await uploadLocal(file, filename);

    return NextResponse.json({ success: true, data: { url, filename } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Dosya yüklenemedi" }, { status: 500 });
  }
}
