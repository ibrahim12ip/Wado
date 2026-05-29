"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

const footerLinks = {
  "Keşfet": [
    { href: "/diziler", label: "Diziler" },
    { href: "/filmler", label: "Filmler" },
    { href: "/programlar", label: "Programlar" },
    { href: "/canli-yayin", label: "Canlı Yayın" },
    { href: "/haberler", label: "Haberler" },
  ],
  "Kategoriler": [
    { href: "/kategori/aksiyon", label: "Aksiyon" },
    { href: "/kategori/komedi", label: "Komedi" },
    { href: "/kategori/dram", label: "Dram" },
    { href: "/kategori/bilim-kurgu", label: "Bilim Kurgu" },
    { href: "/kategori/gerilim", label: "Gerilim" },
  ],
  "Yardım": [
    { href: "#", label: "SSS" },
    { href: "#", label: "Kullanım Koşulları" },
    { href: "#", label: "Gizlilik Politikası" },
    { href: "#", label: "Çerez Politikası" },
    { href: "#", label: "İletişim" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/wado-logo.svg"
                alt="Wado"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-xl font-bold text-white">WADO</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Wado ile sınırsız dizi, film, program ve canlı yayın keyfini çıkarın. Her zaman, her yerde.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
              ].map(({ icon: Icon, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-wado-600 hover:text-white transition-all"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Wado. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Kullanım Koşulları
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Gizlilik
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Çerezler
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
