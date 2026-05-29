"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-wado-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const user = session.user as {
    name?: string;
    email?: string;
    image?: string;
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-8">
            Profil Ayarları
          </h1>

          <div className="glass-dark rounded-2xl p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-wado-500" />
                Ad Soyad
              </label>
              <Input
                value={user.name || ""}
                readOnly
                className="bg-white/5 border-white/10 text-white cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Ad soyad bilgisi şu an güncellenemiyor
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-wado-500" />
                E-posta
              </label>
              <Input
                value={user.email || ""}
                readOnly
                className="bg-white/5 border-white/10 text-white cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                E-posta adresi şu an güncellenemiyor
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Button disabled className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Ayarlar şu an salt okunur moddadır
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
