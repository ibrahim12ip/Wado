# Wado Platform

![Wado](public/images/wado-logo.svg)

**Live:** [wado-platform.vercel.app](https://wado-platform.vercel.app)  
**GitHub:** [github.com/ibrahim12ip/Wado](https://github.com/ibrahim12ip/Wado)

Premium dizi, film ve canlı yayın platformu. NOW TV, Netflix, BluTV seviyesinde modern bir streaming deneyimi.

## 🚀 Özellikler

- **Dizi & Film** - Sınırsız içerik arşivi
- **Canlı Yayın** - 7/24 kesintisiz yayın
- **Haberler** - Güncel haberler
- **Oyuncu Profilleri** - Detaylı oyuncu bilgileri
- **Kategori Sayfaları** - Kategorilere göre içerik keşfi
- **Arama Sistemi** - Gerçek zamanlı arama
- **İzlemeye Devam Et** - Kaldığın yerden devam et
- **Favoriler** - Kişisel favori listen
- **Kullanıcı Paneli** - Kişiselleştirilmiş deneyim
- **Admin Panel** - Tam yönetim paneli
- **Video Player** - HLS destekli özel oynatıcı
- **PWA** - Mobil uygulama deneyimi

## 🛠️ Teknolojiler

- **Frontend:** Next.js 15, React, TypeScript, TailwindCSS, Framer Motion, Shadcn UI
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js
- **Storage:** Cloudinary / AWS S3
- **Player:** HLS.js custom player
- **Deployment:** Vercel

## 📦 Kurulum

```bash
# Repoyu klonla
git clone https://github.com/mustafadonmez0/wado-platform.git
cd wado-platform

# Bağımlılıkları yükle
npm install

# Environment değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenle (DATABASE_URL, NEXTAUTH_SECRET vb.)

# Prisma migration
npx prisma db push

# Seed data
npm run prisma:seed

# Geliştirme sunucusunu başlat
npm run dev
```

## 🗄️ Veritabanı Modelleri

- User, Account, Session
- Series, Episode
- Movie
- Actor, SeriesActor, MovieActor
- Category
- Program
- Comment, Rating
- WatchHistory, Favorite
- Banner, News, LiveStream

## 📁 Proje Yapısı

```
app/
├── (auth)/           # Login, Register
├── (main)/           # Ana sayfa, diziler, filmler, vb.
├── admin/            # Admin panel
├── api/              # API route'ları
components/
├── ui/               # UI bileşenleri
├── layout/           # Header, Footer, MobileNav
├── home/             # Ana sayfa bileşenleri
├── player/           # Video player
├── search/           # Arama sistemi
├── admin/            # Admin bileşenleri
├── shared/           # Paylaşılan bileşenler
lib/                  # Utility fonksiyonlar
prisma/               # Schema ve seed
store/                # Zustand store
types/                # TypeScript tipleri
hooks/                # Custom hooks
```

## 🔑 Varsayılan Hesaplar

- **Admin:** admin@wado.com / admin123
- **User:** user@wado.com / user123

## 🌐 Canlı Demo

[Wado Platform](https://wado-platform.vercel.app)

## 📄 Lisans

MIT
