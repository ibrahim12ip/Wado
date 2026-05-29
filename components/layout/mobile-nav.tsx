"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tv, Film, Radio, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileLinks = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/diziler", label: "Diziler", icon: Tv },
  { href: "/filmler", label: "Filmler", icon: Film },
  { href: "/canli-yayin", label: "Canlı", icon: Radio },
  { href: "/favoriler", label: "Favoriler", icon: Heart },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {mobileLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors",
                isActive ? "text-wado-500" : "text-muted-foreground hover:text-white"
              )}
            >
              <link.icon className={cn("h-5 w-5", isActive && "fill-wado-500/20")} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
