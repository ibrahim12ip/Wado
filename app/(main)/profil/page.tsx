"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { generateInitials, formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-wado-500 border-t-transparent rounded-full" /></div>;
  if (!session) { router.push("/login"); return null; }

  const user = session.user as { name?: string; email?: string; image?: string; id?: string; role?: string };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-dark rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <Avatar className="h-24 w-24 border-4 border-wado-500/30">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="bg-wado-600 text-white text-2xl">{generateInitials(user.name || "U")}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <User className="h-5 w-5 text-wado-500" />
                <div><p className="text-sm text-muted-foreground">Ad Soyad</p><p className="text-white font-medium">{user.name}</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Mail className="h-5 w-5 text-wado-500" />
                <div><p className="text-sm text-muted-foreground">Email</p><p className="text-white font-medium">{user.email}</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Shield className="h-5 w-5 text-wado-500" />
                <div><p className="text-sm text-muted-foreground">Hesap Türü</p><p className="text-white font-medium capitalize">{user.role || "Kullanıcı"}</p></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
