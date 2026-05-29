import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@wado.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@wado.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin.email);

  // Sample user
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@wado.com" },
    update: {},
    create: {
      name: "Test Kullanıcı",
      email: "user@wado.com",
      passwordHash: userPassword,
      role: "USER",
    },
  });
  console.log("User created:", user.email);

  // Categories
  const categories = [
    { name: "Aksiyon", slug: "aksiyon", description: "Aksiyon dolu yapımlar", order: 1 },
    { name: "Komedi", slug: "komedi", description: "Kahkaha dolu yapımlar", order: 2 },
    { name: "Dram", slug: "dram", description: "Duygusal yapımlar", order: 3 },
    { name: "Bilim Kurgu", slug: "bilim-kurgu", description: "Gelecek ve uzay temalı yapımlar", order: 4 },
    { name: "Gerilim", slug: "gerilim", description: "Gerilim dolu yapımlar", order: 5 },
    { name: "Romantik", slug: "romantik", description: "Romantik yapımlar", order: 6 },
    { name: "Belgesel", slug: "belgesel", description: "Belgesel yapımlar", order: 7 },
    { name: "Çizgi Dizi", slug: "cizgi-dizi", description: "Animasyon yapımlar", order: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Categories created");

  // Sample actors
  const actorNames = [
    "Barış Arduç", "Serenay Sarıkaya", "Kıvanç Tatlıtuğ", "Meryem Uzerli",
    "Çağatay Ulusoy", "Demet Özdemir", "Aras Bulut İynemli", "Hande Erçel",
  ];

  for (const name of actorNames) {
    await prisma.actor.upsert({
      where: { slug: name.toLowerCase().replace(/ /g, "-") },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/ /g, "-"), bio: `${name} biyografi bilgisi.` },
    });
  }
  console.log("Actors created");

  // Sample series
  const seriesData = [
    { title: "Kulüp", slug: "kulup", description: "1950'lerin İstanbul'unda geçen etkileyici bir dizi.", posterUrl: "https://picsum.photos/seed/kulup/400/600", backdropUrl: "https://picsum.photos/seed/kulup-bg/1920/1080", year: 2021, imdbRating: 8.2, categorySlug: "dram" },
    { title: "Uyanış: Büyük Selçuklu", slug: "uyanis-buyuk-selcuklu", description: "Büyük Selçuklu İmparatorluğu'nun kuruluş hikayesi.", posterUrl: "https://picsum.photos/seed/selcuklu/400/600", backdropUrl: "https://picsum.photos/seed/selcuklu-bg/1920/1080", year: 2020, imdbRating: 7.8, categorySlug: "aksiyon" },
    { title: "Yargı", slug: "yarji", description: "Adalet sisteminin karmaşık dünyasında geçen bir dizi.", posterUrl: "https://picsum.photos/seed/yarji/400/600", backdropUrl: "https://picsum.photos/seed/yarji-bg/1920/1080", year: 2021, imdbRating: 7.5, categorySlug: "gerilim" },
    { title: "Teşkilat", slug: "teskilat", description: "Türk istihbaratının kahramanlık hikayesi.", posterUrl: "https://picsum.photos/seed/teskilat/400/600", backdropUrl: "https://picsum.photos/seed/teskilat-bg/1920/1080", year: 2021, imdbRating: 7.0, categorySlug: "aksiyon" },
  ];

  for (const data of seriesData) {
    const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } });
    const existing = await prisma.series.findUnique({ where: { slug: data.slug } });
    if (!existing) {
      const series = await prisma.series.create({
        data: {
          title: data.title, slug: data.slug, description: data.description,
          posterUrl: data.posterUrl, backdropUrl: data.backdropUrl,
          year: data.year, imdbRating: data.imdbRating, featured: true,
          categoryId: category?.id || null,
        },
      });

      // Add episodes
      for (let s = 1; s <= 2; s++) {
        for (let e = 1; e <= 3; e++) {
          await prisma.episode.create({
            data: {
              title: `${data.title} S${s} B${e}`,
              slug: `${data.slug}-s${s}b${e}`,
              description: `${data.title} ${s}. sezon ${e}. bölüm`,
              episodeNumber: e, seasonNumber: s,
              duration: 45 + Math.floor(Math.random() * 20),
              thumbnailUrl: `https://picsum.photos/seed/${data.slug}-s${s}b${e}/640/360`,
              videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
              seriesId: series.id,
            },
          });
        }
      }

      // Add actors to series
      const actors = await prisma.actor.findMany({ take: 3, skip: Math.floor(Math.random() * 5) });
      for (let i = 0; i < actors.length; i++) {
        await prisma.seriesActor.create({
          data: { seriesId: series.id, actorId: actors[i].id, role: "Oyuncu", order: i },
        });
      }
    }
  }
  console.log("Series created");

  // Sample movies
  const movieData = [
    { title: "Aile Arasında", slug: "aile-arasinda", description: "Komik bir aile hikayesi.", posterUrl: "https://picsum.photos/seed/aile/400/600", backdropUrl: "https://picsum.photos/seed/aile-bg/1920/1080", year: 2023, imdbRating: 7.2, duration: 124, categorySlug: "komedi" },
    { title: "Mucize", slug: "mucize", description: "Dokunaklı bir dram.", posterUrl: "https://picsum.photos/seed/mucize/400/600", backdropUrl: "https://picsum.photos/seed/mucize-bg/1920/1080", year: 2022, imdbRating: 8.5, duration: 135, categorySlug: "dram" },
  ];

  for (const data of movieData) {
    const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } });
    const existing = await prisma.movie.findUnique({ where: { slug: data.slug } });
    if (!existing) {
      const movie = await prisma.movie.create({
        data: {
          title: data.title, slug: data.slug, description: data.description,
          posterUrl: data.posterUrl, backdropUrl: data.backdropUrl,
          year: data.year, imdbRating: data.imdbRating, duration: data.duration, featured: true,
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          categoryId: category?.id || null,
        },
      });

      const actors = await prisma.actor.findMany({ take: 2 });
      for (let i = 0; i < actors.length; i++) {
        await prisma.movieActor.create({
          data: { movieId: movie.id, actorId: actors[i].id, role: "Oyuncu", order: i },
        });
      }
    }
  }
  console.log("Movies created");

  // Banners
  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    await prisma.banner.createMany({
      data: [
        { title: "Kulüp", description: "1950'lerin İstanbul'unda geçen bu etkileyici hikayeyi kaçırma.", imageUrl: "https://picsum.photos/seed/banner1/1920/800", linkUrl: "/dizi/1", linkText: "Şimdi İzle", order: 0 },
        { title: "Yeni Sezon", description: "Merakla beklenen yeni sezon tüm hızıyla devam ediyor.", imageUrl: "https://picsum.photos/seed/banner2/1920/800", linkUrl: "/diziler", linkText: "Keşfet", order: 1 },
        { title: "Film Arşivi", description: "Binlerce film seni bekliyor. Hemen izlemeye başla.", imageUrl: "https://picsum.photos/seed/banner3/1920/800", linkUrl: "/filmler", linkText: "Filmleri Gör", order: 2 },
      ],
    });
  }
  console.log("Banners created");

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
