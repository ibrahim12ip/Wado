"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Film, Tv, Clapperboard, Users, UserPlus,
  Image, MessageSquare, Radio, Newspaper, Tag, Settings, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/icerikler", label: "Tüm İçerikler", icon: Film },
  { href: "/admin/diziler", label: "Diziler", icon: Tv },
  { href: "/admin/filmler", label: "Filmler", icon: Film },
  { href: "/admin/bolumler", label: "Bölümler", icon: Clapperboard },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: Tag },
  { href: "/admin/oyuncular", label: "Oyuncular", icon: Users },
  { href: "/admin/fragmanlar", label: "Fragmanlar", icon: Image },
  { href: "/admin/banner", label: "Banner", icon: Image },
  { href: "/admin/canli-yayin", label: "Canlı Yayın", icon: Radio },
  { href: "/admin/haberler", label: "Haberler", icon: Newspaper },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: UserPlus },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center bg-black"><div className="animate-spin h-8 w-8 border-2 border-wado-500 border-t-transparent rounded-full" /></div>;

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const userRole = (session?.user as { role?: string })?.role;
  if (userRole !== "ADMIN") {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex">
      <aside className="w-64 bg-black/95 border-r border-white/5 flex-shrink-0 hidden lg:block overflow-y-auto">
        <div className="p-4 border-b border-white/5">
          <Link href="/admin/dashboard" className="text-xl font-bold text-white">Wado Admin</Link>
        </div>
        <nav className="p-3 space-y-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors",
                  isActive ? "bg-wado-600/20 text-wado-400 border border-wado-500/20" : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/5 mt-4">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Settings className="h-4 w-4" />
            Siteye Dön
          </Link>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors">
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
