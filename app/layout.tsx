import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: {
    default: "Wado - Dizi, Film ve Canlı Yayın Platformu",
    template: "%s | Wado",
  },
  description:
    "Wado ile sınırsız dizi, film, program ve canlı yayın keyfini çıkarın. En popüler yapımlar, özel içerikler ve daha fazlası Wado'da.",
  keywords: [
    "dizi",
    "film",
    "canlı yayın",
    "streaming",
    "video platform",
    "Wado",
    "Türkçe dizi",
    "Türkçe film",
  ],
  authors: [{ name: "Wado" }],
  creator: "Wado",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Wado",
    title: "Wado - Dizi, Film ve Canlı Yayın Platformu",
    description:
      "Wado ile sınırsız dizi, film, program ve canlı yayın keyfini çıkarın.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wado - Dizi, Film ve Canlı Yayın Platformu",
    description:
      "Wado ile sınırsız dizi, film, program ve canlı yayın keyfini çıkarın.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
