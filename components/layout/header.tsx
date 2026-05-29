"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Clapperboard,
  Tv,
  Radio,
  Newspaper,
  Film,
  User,
  Heart,
  Clock,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn, generateInitials } from "@/lib/utils";
import { useUIStore } from "@/store";
import { SearchOverlay } from "@/components/search/search-overlay";

const navLinks = [
  { href: "/diziler", label: "Diziler", icon: Tv },
  { href: "/filmler", label: "Filmler", icon: Film },
  { href: "/programlar", label: "Programlar", icon: Clapperboard },
  { href: "/canli-yayin", label: "Canlı Yayın", icon: Radio },
  { href: "/haberler", label: "Haberler", icon: Newspaper },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { isSearchOpen, setSearchOpen, isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-black/90 backdrop-blur-xl shadow-lg shadow-black/20"
            : "bg-gradient-to-b from-black/60 to-transparent"
        )}
      >
        <div className="flex items-center justify-between px-4 md:px-8 h-16 md:h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/wado-logo.svg"
                  alt="Wado"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                WADO
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
              <Search className="h-5 w-5" />
            </button>

            <button className="relative p-2 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/10 hidden md:block">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-wado-500 rounded-full" />
            </button>

            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-wado-600 text-white text-xs">
                      {generateInitials(session.user.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-56 p-1.5 rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-medium text-white truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                      {[
                        { href: "/profil", label: "Profilim", icon: User },
                        { href: "/favoriler", label: "Favorilerim", icon: Heart },
                        { href: "/izleme-gecmisi", label: "İzleme Geçmişi", icon: Clock },
                        { href: "/profil/ayarlar", label: "Ayarlar", icon: Settings },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                      {(session?.user as { role?: string })?.role === "ADMIN" && (
                        <>
                          <div className="border-t border-white/10 mt-1 pt-1" />
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-wado-400 hover:text-wado-300 hover:bg-wado-600/10 rounded-lg transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Shield className="h-4 w-4" />
                            Admin Paneli
                          </Link>
                        </>
                      )}
                      <div className="border-t border-white/10 mt-1 pt-1">
                        <Link
                          href="/api/auth/signout"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Çıkış Yap
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Giriş Yap</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-wado-600 hover:bg-wado-700">Kayıt Ol</Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
            >
              <nav className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
                {!session?.user && (
                  <div className="flex gap-2 pt-4 border-t border-white/10 mt-4">
                    <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Giriş Yap</Button>
                    </Link>
                    <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-wado-600">Kayıt Ol</Button>
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay />
    </>
  );
}
