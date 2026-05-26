const WADO = {
  games: [
    {
      id: 1, title: "Cyberpunk 2077", category: "rpg", rating: 8.7, year: 2020,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_1.jpg",
      description: "Cyberpunk 2077, CD Projekt Red tarafından geliştirilen açık dünya, aksiyon-macera rol yapma oyunudur. Night City'de geçen hikayede, oyuncular V karakterini kontrol eder.",
      features: ["Açık Dünya", "Karakter Özelleştirme", "FPS Savaş", "Hikaye Odaklı"],
      trailer: "https://www.youtube.com/embed/8X2kIfS6fb8",
      steam: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
      epic: "https://store.epicgames.com/en-US/p/cyberpunk-2077",
      tags: ["RPG", "Açık Dünya", "FPS", "Bilim Kurgu"],
      releaseDate: "10 Aralık 2020",
      developer: "CD Projekt Red",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-3570K", ram: "8 GB", gpu: "GTX 780", storage: "70 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-4790", ram: "16 GB", gpu: "RTX 2060", storage: "70 GB" }
      }
    },
    {
      id: 2, title: "Elden Ring", category: "rpg", rating: 9.5, year: 2022,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_1.jpg",
      description: "Elden Ring, FromSoftware tarafından geliştirilen aksiyon-RPG oyunudur. George R.R. Martin ile ortaklaşa oluşturulan geniş bir fantezi dünyasında geçer.",
      features: ["Açık Dünya", "Zorlu Dövüş", "Keşif", "Karakter Geliştirme"],
      trailer: "https://www.youtube.com/embed/Epy9RJGDRzE",
      steam: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
      epic: "https://store.epicgames.com/en-US/p/elden-ring",
      tags: ["RPG", "Açık Dünya", "Souls-like", "Fantezi"],
      releaseDate: "25 Şubat 2022",
      developer: "FromSoftware",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-8400", ram: "12 GB", gpu: "GTX 1060", storage: "60 GB" },
        rec: { os: "Windows 11", cpu: "Intel Core i7-8700K", ram: "16 GB", gpu: "RTX 3060", storage: "60 GB" }
      }
    },
    {
      id: 3, title: "God of War Ragnarök", category: "action", rating: 9.4, year: 2022,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/ss_1.jpg",
      description: "God of War Ragnarök, Santa Monica Studio tarafından geliştirilen aksiyon-macera oyunudur. Kratos ve Atreus'un İskandinav destanı devam ediyor.",
      features: ["Aksiyon", "Hikaye Odaklı", "Bulmaca", "Dövüş Sistemi"],
      trailer: "https://www.youtube.com/embed/EE-4Gvj4mNk",
      steam: "https://store.steampowered.com/app/2322010/God_of_War_Ragnarok/",
      epic: "",
      tags: ["Aksiyon", "Macera", "Hikaye", "Mitoloji"],
      releaseDate: "9 Kasım 2022",
      developer: "Santa Monica Studio",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-4670K", ram: "8 GB", gpu: "GTX 1060", storage: "70 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-7700K", ram: "16 GB", gpu: "RTX 2070", storage: "70 GB" }
      }
    },
    {
      id: 4, title: "Red Dead Redemption 2", category: "open-world", rating: 9.7, year: 2018,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_1.jpg",
      description: "Red Dead Redemption 2, Rockstar Games tarafından geliştirilen açık dünya aksiyon-macera oyunudur. Vahşi Batı'da Arthur Morgan'ın hikayesini anlatır.",
      features: ["Açık Dünya", "Western Teması", "Hikaye", "Çok Oyunculu"],
      trailer: "https://www.youtube.com/embed/gmA6MrX81z4",
      steam: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
      epic: "https://store.epicgames.com/en-US/p/red-dead-redemption-2",
      tags: ["Açık Dünya", "Western", "Aksiyon", "Hikaye"],
      releaseDate: "26 Ekim 2018",
      developer: "Rockstar Games",
      sysReq: {
        min: { os: "Windows 7", cpu: "Intel Core i5-2500K", ram: "8 GB", gpu: "GTX 770", storage: "150 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-4770K", ram: "12 GB", gpu: "RTX 2060", storage: "150 GB" }
      }
    },
    {
      id: 5, title: "Resident Evil 4 Remake", category: "horror", rating: 9.0, year: 2023,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/ss_1.jpg",
      description: "Resident Evil 4, Capcom tarafından yeniden yapılanan hayatta kalma-korku klasiğidir. Leon S. Kennedy'nin macerası tamamen yenilenmiş grafiklerle geri dönüyor.",
      features: ["Hayatta Kalma", "Korku", "Aksiyon", "Yeniden Yapım"],
      trailer: "https://www.youtube.com/embed/BUuF_hL1QqU",
      steam: "https://store.steampowered.com/app/2050650/Resident_Evil_4/",
      epic: "https://store.epicgames.com/en-US/p/resident-evil-4-2023",
      tags: ["Korku", "Hayatta Kalma", "Aksiyon", "Yeniden Yapım"],
      releaseDate: "24 Mart 2023",
      developer: "Capcom",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-7500", ram: "8 GB", gpu: "GTX 1050 Ti", storage: "60 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-8700", ram: "16 GB", gpu: "RTX 2060", storage: "60 GB" }
      }
    },
    {
      id: 6, title: "Forza Horizon 5", category: "racing", rating: 9.1, year: 2021,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/ss_1.jpg",
      description: "Forza Horizon 5, Playground Games tarafından geliştirilen açık dünya yarış oyunudur. Meksika'da geçen oyun, geniş araç yelpazesi ve çarpıcı grafikler sunar.",
      features: ["Açık Dünya", "Yarış", "Araç Koleksiyonu", "Çok Oyunculu"],
      trailer: "https://www.youtube.com/embed/FYH9n37BNoY",
      steam: "https://store.steampowered.com/app/1551360/Forza_Horizon_5/",
      epic: "",
      tags: ["Yarış", "Açık Dünya", "Simülasyon", "Araba"],
      releaseDate: "9 Kasım 2021",
      developer: "Playground Games",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-4460", ram: "8 GB", gpu: "GTX 970", storage: "110 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-10700K", ram: "16 GB", gpu: "RTX 3070", storage: "110 GB" }
      }
    },
    {
      id: 7, title: "Call of Duty: Modern Warfare II", category: "action", rating: 8.3, year: 2022,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/ss_1.jpg",
      description: "Modern Warfare II, Infinity Ward tarafından geliştirilen birinci şahıs nişancı oyunudur. Modern Warfare serisinin devamı niteliğindedir.",
      features: ["FPS", "Çok Oyunculu", "Hikaye", "Savaş"],
      trailer: "https://www.youtube.com/embed/r67q32hO4YY",
      steam: "https://store.steampowered.com/app/1938090/Call_of_Duty_Modern_Warfare_II/",
      epic: "",
      tags: ["FPS", "Aksiyon", "Savaş", "Çok Oyunculu"],
      releaseDate: "28 Ekim 2022",
      developer: "Infinity Ward",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-6600K", ram: "8 GB", gpu: "GTX 960", storage: "125 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-8700K", ram: "16 GB", gpu: "RTX 3060", storage: "125 GB" }
      }
    },
    {
      id: 8, title: "Hogwarts Legacy", category: "rpg", rating: 8.5, year: 2023,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_1.jpg",
      description: "Hogwarts Legacy, Avalanche Software tarafından geliştirilen açık dünya aksiyon-RPG oyunudur. Harry Potter dünyasında geçen oyun, Hogwarts Cadılık ve Büyücülük Okulu'nda geçiyor.",
      features: ["Açık Dünya", "Büyü Sistemi", "Keşif", "RPG"],
      trailer: "https://www.youtube.com/embed/BtyBjvwfK9g",
      steam: "https://store.steampowered.com/app/990080/Hogwarts_Legacy/",
      epic: "https://store.epicgames.com/en-US/p/hogwarts-legacy",
      tags: ["RPG", "Açık Dünya", "Fantezi", "Harry Potter"],
      releaseDate: "10 Şubat 2023",
      developer: "Avalanche Software",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-6600", ram: "16 GB", gpu: "GTX 960", storage: "85 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-8700", ram: "16 GB", gpu: "RTX 2080", storage: "85 GB" }
      }
    },
    {
      id: 9, title: "Starfield", category: "rpg", rating: 7.5, year: 2023,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/ss_1.jpg",
      description: "Starfield, Bethesda Game Studios tarafından geliştirilen bilim kurgu temalı RPG oyunudur. Oyuncular uzayda keşfe çıkıp kendi hikayelerini yazarlar.",
      features: ["Uzay Keşfi", "RPG", "Gemi İnşa", "Hikaye"],
      trailer: "https://www.youtube.com/embed/kfYEiTdsUq4",
      steam: "https://store.steampowered.com/app/1716740/Starfield/",
      epic: "",
      tags: ["RPG", "Bilim Kurgu", "Uzay", "Keşif"],
      releaseDate: "6 Eylül 2023",
      developer: "Bethesda Game Studios",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i7-6800K", ram: "16 GB", gpu: "GTX 1070", storage: "125 GB" },
        rec: { os: "Windows 11", cpu: "Intel Core i7-10700K", ram: "32 GB", gpu: "RTX 2080", storage: "125 GB" }
      }
    },
    {
      id: 10, title: "Baldur's Gate 3", category: "rpg", rating: 9.6, year: 2023,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_1.jpg",
      description: "Baldur's Gate 3, Larian Studios tarafından geliştirilen sıra tabanlı RPG oyunudur. Dungeons & Dragons 5. edisyon kurallarını temel alır.",
      features: ["Sıra Tabanlı", "RPG", "Çok Oyunculu", "Derin Hikaye"],
      trailer: "https://www.youtube.com/embed/1T22iNw3D3Q",
      steam: "https://store.steampowered.com/app/1086940/Baldurs_Gate_3/",
      epic: "",
      tags: ["RPG", "Strateji", "Fantezi", "Sıra Tabanlı"],
      releaseDate: "3 Ağustos 2023",
      developer: "Larian Studios",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-4690", ram: "8 GB", gpu: "GTX 970", storage: "150 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-8700", ram: "16 GB", gpu: "RTX 2060", storage: "150 GB" }
      }
    },
    {
      id: 11, title: "The Last of Us Part I", category: "action", rating: 9.3, year: 2022,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/ss_1.jpg",
      description: "The Last of Us Part I, Naughty Dog tarafından geliştirilen hayatta kalma-aksiyon oyunudur. Joel ve Ellie'nin duygusal yolculuğunu anlatır.",
      features: ["Hayatta Kalma", "Hikaye", "Aksiyon", "Gizlilik"],
      trailer: "https://www.youtube.com/embed/W01L70IGBgE",
      steam: "https://store.steampowered.com/app/1888930/The_Last_of_Us_Part_I/",
      epic: "",
      tags: ["Aksiyon", "Hayatta Kalma", "Hikaye", "Dram"],
      releaseDate: "28 Mart 2023 (PC)",
      developer: "Naughty Dog",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-4430", ram: "8 GB", gpu: "GTX 970", storage: "100 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-8700", ram: "16 GB", gpu: "RTX 2060", storage: "100 GB" }
      }
    },
    {
      id: 12, title: "Marvel's Spider-Man 2", category: "action", rating: 9.0, year: 2023,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2654490/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/2654490/ss_1.jpg",
      description: "Marvel's Spider-Man 2, Insomniac Games tarafından geliştirilen aksiyon-macera oyunudur. Peter Parker ve Miles Morales birlikte savaşıyor.",
      features: ["Açık Dünya", "Aksiyon", "Hikaye", "Süper Kahraman"],
      trailer: "https://www.youtube.com/embed/9fVYKsEME9E",
      steam: "https://store.steampowered.com/app/2654490/Marvels_SpiderMan_2/",
      epic: "",
      tags: ["Aksiyon", "Açık Dünya", "Süper Kahraman", "Hikaye"],
      releaseDate: "20 Ekim 2023",
      developer: "Insomniac Games",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-8400", ram: "16 GB", gpu: "GTX 1060", storage: "75 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-9700", ram: "32 GB", gpu: "RTX 3060", storage: "75 GB" }
      }
    },
    {
      id: 13, title: "Dark Souls III", category: "rpg", rating: 9.2, year: 2016,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/374320/ss_1.jpg",
      description: "Dark Souls III, FromSoftware'in karanlık fantezi dünyasında geçen zorlu bir aksiyon-RPG oyunudur.",
      features: ["Zorlu Dövüş", "Karanlık Fantezi", "Keşif", "Multiplayer"],
      trailer: "https://www.youtube.com/embed/_zDZYrIUgKE",
      steam: "https://store.steampowered.com/app/374320/DARK_SOULS_III/",
      epic: "",
      tags: ["RPG", "Souls-like", "Karanlık", "Zorlu"],
      releaseDate: "24 Mart 2016",
      developer: "FromSoftware",
      sysReq: {
        min: { os: "Windows 7", cpu: "Intel Core i3-2100", ram: "4 GB", gpu: "GTX 750 Ti", storage: "25 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-3770", ram: "8 GB", gpu: "GTX 970", storage: "25 GB" }
      }
    },
    {
      id: 14, title: "Grand Theft Auto V", category: "open-world", rating: 9.5, year: 2013,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_1.jpg",
      description: "Grand Theft Auto V, Rockstar Games'in efsanevi açık dünya aksiyon oyunu. Los Santos'ta üç farklı karakterin hikayesini anlatır.",
      features: ["Açık Dünya", "Aksiyon", "Hikaye", "GTA Online"],
      trailer: "https://www.youtube.com/embed/hvoD7ehZPcM",
      steam: "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/",
      epic: "https://store.epicgames.com/en-US/p/grand-theft-auto-v",
      tags: ["Açık Dünya", "Aksiyon", "Suç", "Multiplayer"],
      releaseDate: "17 Eylül 2013",
      developer: "Rockstar North",
      sysReq: {
        min: { os: "Windows 8.1", cpu: "Intel Core i5-3470", ram: "8 GB", gpu: "GTX 660", storage: "120 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-4770K", ram: "16 GB", gpu: "GTX 1080", storage: "120 GB" }
      }
    },
    {
      id: 15, title: "Horizon Forbidden West", category: "action", rating: 8.8, year: 2022,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2420110/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/2420110/ss_1.jpg",
      description: "Horizon Forbidden West, Guerrilla Games tarafından geliştirilen aksiyon-RPG oyunudur. Aloy'un batıya yolculuğunu anlatır.",
      features: ["Açık Dünya", "Makine Avı", "Hikaye", "Keşif"],
      trailer: "https://www.youtube.com/embed/wQATS4HOxdo",
      steam: "https://store.steampowered.com/app/2420110/Horizon_Forbidden_West/",
      epic: "",
      tags: ["Aksiyon", "Açık Dünya", "RPG", "Bilim Kurgu"],
      releaseDate: "18 Şubat 2022",
      developer: "Guerrilla Games",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-8600", ram: "16 GB", gpu: "GTX 1060", storage: "100 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-9700", ram: "16 GB", gpu: "RTX 3060", storage: "100 GB" }
      }
    },
    {
      id: 16, title: "Hades II", category: "indie", rating: 9.2, year: 2024,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/ss_1.jpg",
      description: "Hades II, Supergiant Games tarafından geliştirilen rogue-like aksiyon oyunudur. Yunan mitolojisinde geçen devam oyunu.",
      features: ["Rogue-like", "Aksiyon", "Mitoloji", "Bağımsız"],
      trailer: "https://www.youtube.com/embed/QMZkR8Y3XTo",
      steam: "https://store.steampowered.com/app/1145350/Hades_II/",
      epic: "",
      tags: ["Indie", "Rogue-like", "Aksiyon", "Mitoloji"],
      releaseDate: "6 Mayıs 2024 (EA)",
      developer: "Supergiant Games",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-4690K", ram: "8 GB", gpu: "GTX 960", storage: "5 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-6700K", ram: "16 GB", gpu: "RTX 2060", storage: "5 GB" }
      }
    },
    {
      id: 17, title: "Stray", category: "indie", rating: 8.5, year: 2022,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1332010/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/1332010/ss_1.jpg",
      description: "Stray, BlueTwelve Studio tarafından geliştirilen kedi macera oyunudur. Bir kedinin siberpunk bir dünyadaki yolculuğunu konu alır.",
      features: ["Kedi Simülasyonu", "Macera", "Siberpunk", "Bulmaca"],
      trailer: "https://www.youtube.com/embed/DSPD5l9SBB8",
      steam: "https://store.steampowered.com/app/1332010/Stray/",
      epic: "https://store.epicgames.com/en-US/p/stray",
      tags: ["Indie", "Macera", "Kedi", "Siberpunk"],
      releaseDate: "19 Temmuz 2022",
      developer: "BlueTwelve Studio",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-2300", ram: "8 GB", gpu: "GTX 650 Ti", storage: "10 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i5-8400", ram: "8 GB", gpu: "GTX 1060", storage: "10 GB" }
      }
    },
    {
      id: 18, title: "Counter-Strike 2", category: "multiplayer", rating: 8.8, year: 2023,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/ss_1.jpg",
      description: "Counter-Strike 2, Valve tarafından geliştirilen ücretsiz taktiksel FPS oyunudur. CS:GO'nun Source 2 motoruyla yenilenmiş versiyonudur.",
      features: ["Taktiksel FPS", "Rekabetçi", "Ücretsiz", "Esport"],
      trailer: "https://www.youtube.com/embed/n0gJ7X05Db4",
      steam: "https://store.steampowered.com/app/730/CounterStrike_2/",
      epic: "",
      tags: ["FPS", "Multiplayer", "Rekabetçi", "Ücretsiz"],
      releaseDate: "27 Eylül 2023",
      developer: "Valve",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-7500", ram: "8 GB", gpu: "GTX 660", storage: "85 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-9700K", ram: "16 GB", gpu: "RTX 2070", storage: "85 GB" }
      }
    },
    {
      id: 19, title: "Palworld", category: "survival", rating: 8.2, year: 2024,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/ss_1.jpg",
      description: "Palworld, Pocketpair tarafından geliştirilen açık dünya hayatta kalma ve yaratık toplama oyunudur. Pokemon benzeri Pals ile silahlı bir dünyada hayatta kalın.",
      features: ["Hayatta Kalma", "Yaratık Toplama", "İnşa", "Çok Oyunculu"],
      trailer: "https://www.youtube.com/embed/EhcWgfBcHp4",
      steam: "https://store.steampowered.com/app/1623730/Palworld/",
      epic: "",
      tags: ["Hayatta Kalma", "Açık Dünya", "Yaratık", "İnşa"],
      releaseDate: "19 Ocak 2024 (EA)",
      developer: "Pocketpair",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i5-3570K", ram: "16 GB", gpu: "GTX 1050", storage: "40 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i7-4790", ram: "32 GB", gpu: "RTX 2060", storage: "40 GB" }
      }
    },
    {
      id: 20, title: "Ghost of Tsushima", category: "action", rating: 9.0, year: 2020,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg",
      bg: "https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/ss_1.jpg",
      description: "Ghost of Tsushima DIRECTOR'S CUT, Sucker Punch Productions tarafından geliştirilen aksiyon-macera oyunudur. Feodal Japonya'da bir samurayın hikayesi.",
      features: ["Açık Dünya", "Samuray", "Gizlilik", "Hikaye"],
      trailer: "https://www.youtube.com/embed/9pqPpx3JxOU",
      steam: "https://store.steampowered.com/app/2215430/Ghost_of_Tsushima_DIRECTORS_CUT/",
      epic: "",
      tags: ["Aksiyon", "Açık Dünya", "Samuray", "Tarih"],
      releaseDate: "17 Temmuz 2020",
      developer: "Sucker Punch Productions",
      sysReq: {
        min: { os: "Windows 10", cpu: "Intel Core i3-8100", ram: "8 GB", gpu: "GTX 960", storage: "75 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i5-8600", ram: "16 GB", gpu: "RTX 2060", storage: "75 GB" }
      }
    }
  ],

  reviews: [
    { id: 1, gameId: 2, title: "Elden Ring: Bir Çağın Başlangıcı", score: 9.5, author: "Wado Editör", excerpt: "FromSoftware yine zirvede. Elden Ring açık dünya ve zorlu dövüşlerle tüm beklentileri karşılıyor.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg", date: "2024-12-15" },
    { id: 2, gameId: 3, title: "God of War Ragnarök - Bir Şaheser", score: 9.4, author: "Wado Editör", excerpt: "Kratos ve Atreus'un hikayesi duygusal bir finalle taçlanıyor.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg", date: "2024-11-28" },
    { id: 3, gameId: 10, title: "Baldur's Gate 3 - RPG Türünün Zirvesi", score: 9.6, author: "Wado Editör", excerpt: "Larian Studios, RPG türünde yeni bir çıta belirliyor.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg", date: "2024-12-01" },
    { id: 4, gameId: 4, title: "Red Dead Redemption 2 - Bir Kült Klasik", score: 9.7, author: "Wado Editör", excerpt: "Rockstar'ın başyapıtı, açık dünya oyunlarının altın standardı olmaya devam ediyor.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg", date: "2024-10-05" },
    { id: 5, gameId: 5, title: "Resident Evil 4 Remake: Korkunun Yeniden Doğuşu", score: 9.0, author: "Wado Editör", excerpt: "Capcom, bir klasiği modern grafikler ve oynanışla yeniden hayata geçiriyor.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg", date: "2024-09-20" },
    { id: 6, gameId: 6, title: "Forza Horizon 5 - Yarışın Zirvesi", score: 9.1, author: "Wado Editör", excerpt: "Meksika'da geçen bu açık dünya yarış deneyimi görsel bir şölen.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg", date: "2024-08-15" }
  ],

  news: [
    { id: 1, title: "GTA 6 Çıkış Tarihi Sızdırıldı!", excerpt: "Grand Theft Auto 6'nın 2025 sonbaharında çıkacağı iddia ediliyor. Rockstar henüz resmi açıklama yapmadı.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg", date: "2026-05-26", category: "Duyuru" },
    { id: 2, title: "Nintendo Switch 2 Resmi Olarak Duyuruldu", excerpt: "Nintendo, yeni nesil konsolunu resmen duyurdu. Geriye uyumluluk ve gelişmiş grafikler sunacak.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg", date: "2026-05-25", category: "Donanım" },
    { id: 3, title: "Half-Life 3 Geliştiriliyor mu? Valve'dan İpuçları", excerpt: "Valve'ın yeni projeleri arasında Half-Life 3'ün de olduğu konuşuluyor. Şirketten gelen sinyaller heyecan yarattı.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg", date: "2026-05-24", category: "Söylenti" },
    { id: 4, title: "RTX 5090 Tanıtıldı: 4K'da 240 FPS Mümkün", excerpt: "NVIDIA'nın yeni nesil ekran kartı RTX 5090, çığır açan performansıyla oyun dünyasını sarsmaya hazırlanıyor.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg", date: "2026-05-23", category: "Donanım" },
    { id: 5, title: "Cyberpunk 2077'nin Yeni Eklentisi Yolda", excerpt: "CD Projekt Red, Cyberpunk 2077 için yeni bir hikaye eklentisi üzerinde çalıştığını doğruladı.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg", date: "2026-05-22", category: "Duyuru" },
    { id: 6, title: "Steam Yaz İndirimleri Başladı", excerpt: "Steam'in dev yaz indirimleri başladı! Binlerce oyunda %90'a varan indirimler sizi bekliyor.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg", date: "2026-05-21", category: "Etkinlik" }
  ],

  blogPosts: [
    { id: 1, title: "2026'nın En İyi FPS Oyunları", category: "fps", content: "2026 yılı, FPS türünde olağanüstü oyunlara ev sahipliği yapıyor. İşte kaçırmamanız gereken en iyi FPS oyunları...\n\n## En İyi FPS Oyunları 2026\n\nBu yıl FPS türünde birçok kaliteli yapım piyasaya sürüldü. İşte mutlaka denemeniz gereken oyunlar:\n\n### 1. Call of Duty: Black Ops 7\nYeni nesil grafikler ve akıcı oynanışıyla serinin en iyi oyunlarından biri.\n\n### 2. Battlefield 2043\nDaha büyük haritalar, daha gerçekçi fizik motoru ve yıkılabilir çevre.\n\n### 3. Overwatch 3\nBlizzard'ın popüler takım tabanlı nişancı oyununun yeni versiyonu.\n\n### Düşük Sistem İçin FPS Oyunları\nEğer sisteminiz kısıtlıysa, Valorant, CS2 ve Rainbow Six Siege gibi oyunları deneyebilirsiniz.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/header.jpg", date: "2026-05-20", author: "Wado Editör", authorImage: "https://i.pravatar.cc/40?img=1", readTime: "5 dk" },
    { id: 2, title: "Düşük Sistem İçin En İyi Oyunlar 2026", category: "low-system", content: "Düşük sistemli bilgisayarlarda akıcı bir şekilde oynayabileceğiniz en iyi oyunları derledik.\n\n## Düşük Sistem Oyun Önerileri\n\nHerkesin yüksek bütçeli bir oyuncu bilgisayarı olmayabilir. İşte düşük sistemlerde bile akıcı çalışan oyunlar:\n\n### 1. Valorant\nRiot Games'in taktiksel FPS oyunu, çok düşük sistemlerde bile 60+ FPS çalışıyor.\n\n### 2. Minecraft\nDünyanın en çok satan oyunu, neredeyse her sistemde çalışır.\n\n### 3. League of Legends\nPopüler MOBA oyunu, düşük sistem dostu.\n\n### 4. CS2\nCounter-Strike 2, optimize edilmiş motoruyla düşük sistemlerde iyi performans sunar.\n\n### 5. Stardew Valley\nHarika bir bağımsız çiftçilik simülasyonu.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg", date: "2026-05-18", author: "Wado Editör", authorImage: "https://i.pravatar.cc/40?img=2", readTime: "4 dk" },
    { id: 3, title: "RTX 4060 İçin Oyun Tavsiyeleri", category: "hardware", content: "RTX 4060 ekran kartınız için en iyi oyun ayarları ve performans rehberi.\n\n## RTX 4060 ile Hangi Oyunlar Kaç FPS Verir?\n\nNVIDIA'nın orta seviye ekran kartı RTX 4060, 1080p ve 1440p'de harika bir performans sunar.\n\n### 1080p Ultra Ayarlar\n- Cyberpunk 2077: 75-85 FPS (DLSS ile)\n- Elden Ring: 60 FPS (sabit)\n- Hogwarts Legacy: 70-80 FPS\n- Forza Horizon 5: 90-100 FPS\n\n### 1440p Yüksek Ayarlar\n- CS2: 200+ FPS\n- Valorant: 300+ FPS\n- Apex Legends: 120-140 FPS\n\nRTX 4060, 1080p için mükemmel, 1440p için iyi bir seçenek.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg", date: "2026-05-15", author: "Wado Editör", authorImage: "https://i.pravatar.cc/40?img=3", readTime: "6 dk" },
    { id: 4, title: "Online Arkadaşlarla Oynanacak En İyi Oyunlar", category: "multiplayer", content: "Arkadaşlarınızla birlikte oynayabileceğiniz en eğlenceli çok oyunculu oyunlar.\n\n## Arkadaşlarla Oynanacak Oyunlar\n\n### 1. Among Us\n5-10 kişilik sosyal çıkarım oyunu.\n\n### 2. It Takes Two\nSadece iki kişilik, muhteşem bir kooperatif deneyimi.\n\n### 3. Fortnite\nÜcretsiz battle royale, sürekli güncellenen içerikler.\n\n### 4. Minecraft\nSınırsız yaratıcılık, kendi dünyanızı arkadaşlarınızla inşa edin.\n\n### 5. GTA Online\nLos Santos'ta arkadaşlarınızla kaos yaratın.\n\n### 6. Palworld\nArkadaşlarınızla birlikte Pals toplayın ve üs kurun.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg", date: "2026-05-12", author: "Wado Editör", authorImage: "https://i.pravatar.cc/40?img=4", readTime: "7 dk" },
    { id: 5, title: "En İyi Korku Oyunları 2026", category: "horror", content: "2026'da sizi korkutacak en iyi korku oyunlarını sizin için derledik.\n\n## 2026'nın En Korkunç Oyunları\n\n### 1. Silent Hill f\nKonami'nin uzun süredir beklenen dönüşü.\n\n### 2. Resident Evil 9\nCapcom korku serisine yeni bir soluk getiriyor.\n\n### 3. Alan Wake 3\nRemedy Entertainment'ın psikolojik korku devamı.\n\n### Klasik Korku Oyunları\nHala oynamadıysanız: Outlast, Amnesia, Alien Isolation.\n\n### Düşük Sistem Korku Oyunları\nDarkwood, Cry of Fear, Lost in Vivo.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg", date: "2026-05-10", author: "Wado Editör", authorImage: "https://i.pravatar.cc/40?img=5", readTime: "5 dk" },
    { id: 6, title: "En Gerçekçi Yarış Oyunları", category: "racing", content: "Gerçekçilik ve simülasyon tutkunları için en iyi yarış oyunları.\n\n## Simülasyon Yarış Oyunları\n\n### 1. Assetto Corsa Competizione\nGT dünyasının en gerçekçi simülasyonu.\n\n### 2. iRacing\nProfesyonel yarış simülasyonunun zirvesi.\n\n### 3. Forza Motorsport\nXbox ve PC için en iyi yarış simülasyonu.\n\n### Arcade Ama Gerçekçi\nForza Horizon 5, gerçekçi grafiklerle arcade oynanışı birleştiriyor.\n\n### Düşük Sistem Yarış Oyunları\nNeed for Speed Heat, F1 23.", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg", date: "2026-05-08", author: "Wado Editör", authorImage: "https://i.pravatar.cc/40?img=6", readTime: "4 dk" }
  ],

  // Download metadata per game — direct downloads
  downloads: {
    1: { fileSize: '70 GB', type: 'paid', downloads: 15420, downloadUrl: 'https://cdn.wado.com/games/cyberpunk-2077.part1.rar' },
    2: { fileSize: '60 GB', type: 'paid', downloads: 28900, downloadUrl: 'https://cdn.wado.com/games/elden-ring.part1.rar' },
    3: { fileSize: '70 GB', type: 'paid', downloads: 22100, downloadUrl: 'https://cdn.wado.com/games/god-of-war-ragnarok.part1.rar' },
    4: { fileSize: '150 GB', type: 'paid', downloads: 35200, downloadUrl: 'https://cdn.wado.com/games/rdr2.part1.rar' },
    5: { fileSize: '60 GB', type: 'paid', downloads: 18300, downloadUrl: 'https://cdn.wado.com/games/re4-remake.part1.rar' },
    6: { fileSize: '110 GB', type: 'paid', downloads: 19700, downloadUrl: 'https://cdn.wado.com/games/forza-horizon-5.part1.rar' },
    7: { fileSize: '125 GB', type: 'paid', downloads: 25600, downloadUrl: 'https://cdn.wado.com/games/mw2.part1.rar' },
    8: { fileSize: '85 GB', type: 'paid', downloads: 31400, downloadUrl: 'https://cdn.wado.com/games/hogwarts-legacy.part1.rar' },
    9: { fileSize: '125 GB', type: 'paid', downloads: 12800, downloadUrl: 'https://cdn.wado.com/games/starfield.part1.rar' },
    10: { fileSize: '150 GB', type: 'paid', downloads: 27500, downloadUrl: 'https://cdn.wado.com/games/baldurs-gate-3.part1.rar' },
    11: { fileSize: '100 GB', type: 'paid', downloads: 16200, downloadUrl: 'https://cdn.wado.com/games/tlou-part1.part1.rar' },
    12: { fileSize: '75 GB', type: 'paid', downloads: 18900, downloadUrl: 'https://cdn.wado.com/games/spiderman-2.part1.rar' },
    13: { fileSize: '25 GB', type: 'paid', downloads: 34100, downloadUrl: 'https://cdn.wado.com/games/dark-souls-3.part1.rar' },
    14: { fileSize: '120 GB', type: 'paid', downloads: 52300, downloadUrl: 'https://cdn.wado.com/games/gta5.part1.rar' },
    15: { fileSize: '100 GB', type: 'paid', downloads: 14800, downloadUrl: 'https://cdn.wado.com/games/horizon-fw.part1.rar' },
    16: { fileSize: '5 GB', type: 'paid', downloads: 9100, downloadUrl: 'https://cdn.wado.com/games/hades-2.zip' },
    17: { fileSize: '10 GB', type: 'paid', downloads: 12600, downloadUrl: 'https://cdn.wado.com/games/stray.zip' },
    18: { fileSize: '85 GB', type: 'free', downloads: 89700, downloadUrl: 'https://cdn.wado.com/games/cs2-setup.exe' },
    19: { fileSize: '40 GB', type: 'paid', downloads: 23400, downloadUrl: 'https://cdn.wado.com/games/palworld.part1.rar' },
    20: { fileSize: '75 GB', type: 'paid', downloads: 17600, downloadUrl: 'https://cdn.wado.com/games/ghost-of-tsushima.part1.rar' }
  },

  getGame(id) { return this.games.find(g => g.id === id); },
  getGamesByCategory(cat) { return cat === 'all' ? this.games : this.games.filter(g => g.category === cat); },
  getPopular() { return [...this.games].sort((a, b) => b.rating - a.rating); },
  getNewest() { return [...this.games].sort((a, b) => b.year - a.year || b.id - a.id); },
  getEditorsChoice() { return this.games.filter(g => g.rating >= 9.0); },
  getLatestNews() { return this.news.sort((a, b) => new Date(b.date) - new Date(a.date)); },
  getLatestBlog() { return this.blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date)); },
  getLatestReviews() { return this.reviews.sort((a, b) => new Date(b.date) - new Date(a.date)); },
  getDownloadInfo(gameId) {
    const game = this.getGame(gameId);
    if (!game) return null;
    const dl = this.downloads[gameId] || { fileSize: 'Bilinmiyor', type: 'paid', downloads: 0, downloadUrl: '#' };
    return { ...dl, game };
  },
  getTopDownloads(limit = 12) {
    return [...this.games].map(g => ({ ...g, ...this.downloads[g.id] }))
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, limit);
  },
  searchGames(query) {
    const q = query.toLowerCase();
    return this.games.filter(g => g.title.toLowerCase().includes(q) || g.tags.some(t => t.toLowerCase().includes(q)) || g.description.toLowerCase().includes(q));
  },
  searchDownloads(query) {
    const q = query.toLowerCase();
    return this.games.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.tags.some(t => t.toLowerCase().includes(q)) ||
      g.category.toLowerCase().includes(q)
    ).map(g => ({ ...g, ...this.downloads[g.id] }));
  },
  searchBlog(query) {
    const q = query.toLowerCase();
    return this.blogPosts.filter(b => b.title.toLowerCase().includes(q) || b.content.toLowerCase().includes(q));
  },
  searchNews(query) {
    const q = query.toLowerCase();
    return this.news.filter(n => n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q));
  }
};
