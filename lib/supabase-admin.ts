import { createClient } from "@supabase/supabase-js";

const supabaseUrl = () => process.env.SUPABASE_URL || "";
const supabaseServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getAdmin() {
  const url = supabaseUrl();
  const key = supabaseServiceKey();
  if (!url || !key) throw new Error("Supabase storage ayarları eksik. SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function ensureBucket() {
  const supabase = getAdmin();
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === "videos")) {
    await supabase.storage.createBucket("videos", {
      public: true,
      fileSizeLimit: 524288000,
      allowedMimeTypes: ["video/mp4", "video/webm", "video/x-matroska", "video/quicktime", "video/x-msvideo"],
    });
  }
}

export function uploadToSupabase(filename: string, buffer: Buffer, contentType: string) {
  const supabase = getAdmin();
  return supabase.storage.from("videos").upload(filename, buffer, {
    contentType,
    upsert: false,
  });
}

export function getPublicUrl(filename: string) {
  const supabase = getAdmin();
  return supabase.storage.from("videos").getPublicUrl(filename);
}
