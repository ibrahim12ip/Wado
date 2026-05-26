require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Game = require('./models/Game');
const Blog = require('./models/Blog');
const Slider = require('./models/Slider');
const connectDB = require('./config/db');

const seed = async () => {
  try {
    await connectDB();
    console.log('Veritabanı temizleniyor...');
    await Promise.all([
      User.deleteMany({}), Category.deleteMany({}),
      Game.deleteMany({}), Blog.deleteMany({}), Slider.deleteMany({})
    ]);

    // Admin Kullanıcı
    const admin = await User.create({
      username: 'admin', email: 'admin@wado.com', password: 'admin123',
      role: 'admin', badges: ['Admin', 'Kurucu']
    });

    // Kategoriler
    const categories = await Category.insertMany([
      { name: 'FPS', slug: 'fps', icon: '🎯', color: '#ef4444', order: 1 },
      { name: 'Korku', slug: 'horror', icon: '👻', color: '#8b5cf6', order: 2 },
      { name: 'Hayatta Kalma', slug: 'survival', icon: '🏕️', color: '#f59e0b', order: 3 },
      { name: 'Açık Dünya', slug: 'open-world', icon: '🌍', color: '#10b981', order: 4 },
      { name: 'Simülasyon', slug: 'simulation', icon: '🎮', color: '#06b6d4', order: 5 },
      { name: 'Yarış', slug: 'racing', icon: '🏎️', color: '#ec4899', order: 6 },
      { name: 'RPG', slug: 'rpg', icon: '⚔️', color: '#a855f7', order: 7 },
      { name: 'Online', slug: 'online', icon: '🌐', color: '#3b82f6', order: 8 },
      { name: 'Sandbox', slug: 'sandbox', icon: '🏗️', color: '#f97316', order: 10 },
      { name: 'Battle Royale', slug: 'battle-royale', icon: '🏆', color: '#e11d48', order: 11 },
      { name: 'Indie', slug: 'indie', icon: '💎', color: '#14b8a6', order: 12 },
      { name: 'Spor', slug: 'sports', icon: '⚽', color: '#22c55e', order: 9 },
      { name: 'Anime', slug: 'anime', icon: '🌸', color: '#d946ef', order: 13 },
    ]);

    const fps = categories.find(c => c.slug === 'fps');
    const horror = categories.find(c => c.slug === 'horror');
    const survival = categories.find(c => c.slug === 'survival');
    const openWorld = categories.find(c => c.slug === 'open-world');
    const racing = categories.find(c => c.slug === 'racing');
    const rpg = categories.find(c => c.slug === 'rpg');

    // Örnek Oyunlar
    const games = await Game.insertMany([
      {
        title: 'Cyberpunk 2077',
        slug: 'cyberpunk-2077',
        description: 'Cyberpunk 2077, CD Projekt Red tarafından geliştirilen açık dünya, aksiyon-macera RPG oyunudur. Night City\'nin karanlık sokaklarında geçen bu epik hikayede, V karakterini yönetiyor ve mega şirketlerle savaşıyorsunuz.',
        story: '2077 yılında Night City\'de geçen hikaye, V adında bir paralı askerin etrafında dönüyor. Johnny Silverhand\'in anılarıyla mücadele ederken, ölümcül bir tehditle yüzleşiyor.',
        coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600',
        screenshots: [
          'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
          'https://images.unsplash.com/photo-1552820728-8b83bb6b2d6b?w=800',
        ],
        category: openWorld._id,
        tags: ['open-world', 'rpg', 'fps', 'sci-fi'],
        publisher: 'CD Projekt Red',
        releaseDate: new Date('2020-12-10'),
        size: '68.5 GB',
        version: '2.1',
        languages: ['İngilizce', 'Türkçe', 'Fransızca', 'Almanca'],
        hasTurkishPatch: true,
        isCompressed: false,
        isFullVersion: true,
        hasTorrent: true,
        systemRequirements: {
          minimum: { os: 'Windows 10', processor: 'Intel i5-3570K', memory: '8 GB', graphics: 'GTX 780', storage: '70 GB', directx: '12' },
          recommended: { os: 'Windows 10', processor: 'Intel i7-4790K', memory: '16 GB', graphics: 'RTX 2060', storage: '70 GB', directx: '12' }
        },
        downloadLinks: [{ label: 'Google Drive', url: '#', type: 'direct' }, { label: 'Torrent', url: '#', type: 'torrent' }, { label: 'Part 1', url: '#', type: 'part' }],
        installGuide: '<p>1. İndirilen dosyayı WinRAR ile çıkarın<br>2. Kurulum dosyasını çalıştırın<br>3. Talimatları takip edin<br>4. Oynayın!</p>',
        rating: 8.7, downloadCount: 45231, viewCount: 125430, likeCount: 3210,
        isFeatured: true, isTrending: true, isEditorPick: true, isActive: true
      },
      {
        title: 'Grand Theft Auto V',
        slug: 'gta-5',
        description: 'Rockstar Games\'in efsanevi açık dünya oyunu GTA V, Los Santos şehrinde üç farklı karakterin hikayesini anlatıyor.',
        story: 'Michael, Franklin ve Trevor - üç farklı suçlunun kesişen yolları...',
        coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600',
        screenshots: ['https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800'],
        category: openWorld._id,
        tags: ['open-world', 'action', 'adventure', 'multiplayer'],
        publisher: 'Rockstar Games',
        releaseDate: new Date('2013-09-17'),
        size: '105 GB',
        version: '1.68',
        languages: ['İngilizce', 'Türkçe', 'Fransızca', 'Almanca', 'İspanyolca'],
        hasTurkishPatch: true,
        isFullVersion: true,
        hasTorrent: true,
        isOnline: true,
        isMultiplayer: true,
        systemRequirements: {
          minimum: { os: 'Windows 10', processor: 'Intel i3 2100', memory: '8 GB', graphics: 'GTX 660', storage: '110 GB', directx: '11' },
          recommended: { os: 'Windows 10', processor: 'Intel i5 3470', memory: '16 GB', graphics: 'GTX 1080', storage: '110 GB', directx: '11' }
        },
        downloadLinks: [{ label: 'Torrent', url: '#', type: 'torrent' }],
        installGuide: '<p>Kurulum için talimatları izleyin.</p>',
        rating: 9.2, downloadCount: 89215, viewCount: 256780, likeCount: 5430,
        isFeatured: true, isTrending: true, isEditorPick: true, isLowSpec: false, isActive: true
      },
      {
        title: 'Resident Evil 4 Remake',
        slug: 'resident-evil-4-remake',
        description: 'Capcom\'un korku klasiğinin nefes kesen yeniden yapımı.',
        story: 'Leon S. Kennedy, kaçırılan başkanın kızını kurtarmak için İspanya\'nın ücra bir köyüne gider.',
        coverImage: 'https://images.unsplash.com/photo-1552074284-5e88ef1aefc8?w=600',
        screenshots: ['https://images.unsplash.com/photo-1552074284-5e88ef1aefc8?w=800'],
        category: horror._id,
        tags: ['horror', 'survival', 'action', 'remake'],
        publisher: 'Capcom',
        releaseDate: new Date('2023-03-24'),
        size: '58.2 GB',
        version: '1.0',
        languages: ['İngilizce', 'Türkçe', 'Fransızca', 'Japonca'],
        hasTurkishPatch: false,
        isFullVersion: true,
        systemRequirements: {
          minimum: { os: 'Windows 10', processor: 'Ryzen 3 1200', memory: '8 GB', graphics: 'GTX 1050 Ti', storage: '60 GB', directx: '12' },
          recommended: { os: 'Windows 10', processor: 'Ryzen 5 3600', memory: '16 GB', graphics: 'RTX 2060', storage: '60 GB', directx: '12' }
        },
        downloadLinks: [{ label: 'Direct', url: '#', type: 'direct' }],
        rating: 9.0, downloadCount: 34210, viewCount: 98760, likeCount: 2890,
        isFeatured: true, isTrending: true, isActive: true
      },
      {
        title: 'The Last of Us Part I',
        slug: 'the-last-of-us-part-1',
        description: 'Naughty Dog\'un ödüllü oyunu, PC\'de yeniden yayınlandı.',
        story: 'Bir salgın sonrası dünyada, Joel ve Ellie\'nin duygusal yolculuğu.',
        coverImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600',
        screenshots: [],
        category: survival._id,
        tags: ['survival', 'action', 'adventure', 'story-rich'],
        publisher: 'Naughty Dog / Sony',
        size: '78.3 GB',
        version: '1.1.2',
        languages: ['İngilizce', 'Türkçe'],
        hasTurkishPatch: true,
        isFullVersion: true,
        systemRequirements: {
          minimum: { os: 'Windows 10', processor: 'Ryzen 3 1200', memory: '16 GB', graphics: 'GTX 970', storage: '80 GB', directx: '12' },
          recommended: { os: 'Windows 10', processor: 'Ryzen 5 3600', memory: '16 GB', graphics: 'RTX 2070', storage: '80 GB', directx: '12' }
        },
        downloadLinks: [{ label: 'Google Drive', url: '#', type: 'direct' }],
        rating: 9.5, downloadCount: 28750, viewCount: 87600, likeCount: 3450,
        isFeatured: true, isEditorPick: true, isActive: true
      },
      {
        title: 'Forza Horizon 5',
        slug: 'forza-horizon-5',
        description: 'Xbox oyun stüdyolarının en iyi yarış oyunu Meksika\'da.',
        story: 'Meksika\'nın en geniş ve çeşitli açık dünyasında yarışın.',
        coverImage: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600',
        category: racing._id,
        tags: ['racing', 'open-world', 'simulation', 'arcade'],
        publisher: 'Playground Games',
        size: '116 GB',
        version: '1.0',
        languages: ['İngilizce', 'Türkçe', 'Almanca'],
        hasTurkishPatch: true,
        isFullVersion: true,
        isOnline: true,
        systemRequirements: {
          minimum: { os: 'Windows 10', processor: 'i5-4460', memory: '8 GB', graphics: 'GTX 970', storage: '120 GB', directx: '12' },
          recommended: { os: 'Windows 10', processor: 'i7-10700K', memory: '16 GB', graphics: 'RTX 3070', storage: '120 GB', directx: '12' }
        },
        downloadLinks: [{ label: 'Torrent', url: '#', type: 'torrent' }],
        rating: 9.3, downloadCount: 56780, viewCount: 134500, likeCount: 4210,
        isFeatured: true, isTrending: true, isActive: true
      },
      {
        title: 'Elden Ring',
        slug: 'elden-ring',
        description: 'FromSoftware ve George R.R. Martin\'in epik RPG oyunu.',
        story: 'Tarnished olarak uyanıyor, Elden Ring\'i bulmak için Lands Between\'de dev bir maceraya atılıyorsunuz.',
        coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
        category: rpg._id,
        tags: ['rpg', 'open-world', 'action', 'souls-like'],
        publisher: 'FromSoftware / Bandai Namco',
        size: '49.2 GB',
        version: '1.10',
        languages: ['İngilizce', 'Fransızca', 'Almanca'],
        hasTurkishPatch: true,
        isFullVersion: true,
        hasTorrent: true,
        systemRequirements: {
          minimum: { os: 'Windows 10', processor: 'i5-8400', memory: '12 GB', graphics: 'GTX 1060', storage: '60 GB', directx: '12' },
          recommended: { os: 'Windows 10', processor: 'i7-8700K', memory: '16 GB', graphics: 'RTX 3070', storage: '60 GB', directx: '12' }
        },
        downloadLinks: [{ label: 'Direct', url: '#', type: 'direct' }, { label: 'Torrent', url: '#', type: 'torrent' }],
        rating: 9.8, downloadCount: 72340, viewCount: 198700, likeCount: 6780,
        isFeatured: true, isTrending: true, isEditorPick: true, isActive: true
      },
      {
        title: 'Stardew Valley',
        slug: 'stardew-valley',
        description: 'Pelican Town\'da çiftlik hayatının tadını çıkarın.',
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
        category: categories.find(c => c.slug === 'simulation')._id,
        tags: ['simulation', 'indie', 'farming', 'relaxing'],
        publisher: 'ConcernedApe',
        size: '1.2 GB',
        version: '1.6',
        languages: ['İngilizce', 'Türkçe', 'Fransızca', 'Almanca'],
        hasTurkishPatch: true,
        isFullVersion: true,
        isLowSpec: true,
        systemRequirements: {
          minimum: { os: 'Windows 7', processor: '2.0 GHz', memory: '2 GB', graphics: '256 MB VRAM', storage: '2 GB', directx: '10' },
          recommended: { os: 'Windows 10', processor: '2.4 GHz', memory: '4 GB', graphics: '512 MB VRAM', storage: '2 GB', directx: '11' }
        },
        downloadLinks: [{ label: 'Google Drive', url: '#', type: 'direct' }],
        rating: 9.4, downloadCount: 89210, viewCount: 165400, likeCount: 5430,
        isFeatured: false, isTrending: false, isLowSpec: true, isActive: true
      },
      {
        title: 'Counter-Strike 2',
        slug: 'counter-strike-2',
        description: 'Valve\'ın ikonik FPS oyunu Source 2 motoruyla yenilendi.',
        coverImage: 'https://images.unsplash.com/photo-1556438064-2d76447b76c9?w=600',
        category: fps._id,
        tags: ['fps', 'online', 'multiplayer', 'competitive', 'free-to-play'],
        publisher: 'Valve',
        size: '34 GB',
        version: '1.0',
        languages: ['İngilizce', 'Türkçe'],
        hasTurkishPatch: true,
        isFullVersion: true,
        isOnline: true,
        isMultiplayer: true,
        isCoop: false,
        systemRequirements: {
          minimum: { os: 'Windows 10', processor: 'i5-7500', memory: '8 GB', graphics: 'GTX 960', storage: '35 GB', directx: '11' },
          recommended: { os: 'Windows 10', processor: 'i7-9700K', memory: '16 GB', graphics: 'RTX 2060', storage: '35 GB', directx: '11' }
        },
        downloadLinks: [{ label: 'Steam', url: '#', type: 'direct' }],
        rating: 8.9, downloadCount: 124560, viewCount: 345000, likeCount: 8900,
        isFeatured: true, isTrending: true, isActive: true
      }
    ]);

    // Slider
    await Slider.insertMany([
      { title: 'Yeni Çıkan Oyunlar', subtitle: 'En yeni ve heyecan verici oyunları keşfedin', backgroundImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200', buttonText: 'Keşfet', link: '/yeni-oyunlar', order: 1 },
      { title: 'En Çok İndirilenler', subtitle: 'Topluluğumuzun favori oyunları', backgroundImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200', buttonText: 'Görüntüle', link: '/populer', order: 2 },
      { title: 'Editörün Seçimi', subtitle: 'En iyi oyun deneyimleri burada', backgroundImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200', buttonText: 'İncele', link: '/editor-secimi', order: 3 },
    ]);

    // Blog
    await Blog.insertMany([
      {
        title: '2026\'nın En İyi 10 Oyunu',
        slug: '2026-en-iyi-10-oyun',
        content: '<p>2026 yılı oyun dünyası için inanılmaz bir yıl oldu. İşte kaçırmamanız gereken en iyi 10 oyun...</p><h2>1. Cyberpunk 2077: Ultimate Edition</h2><p>CD Projekt Red\'in muhteşem açık dünya oyunu artık tüm DLC\'leriyle birlikte.</p><h2>2. Elden Ring: Shadow of the Erdtree</h2><p>FromSoftware\'in efsanevi DLC\'si...</p>',
        excerpt: '2026 yılında mutlaka oynamanız gereken 10 oyunluk liste.',
        coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        author: admin._id,
        category: 'list',
        tags: ['2026', 'en-iyi-oyunlar', 'liste', 'tavsiye'],
        isFeatured: true
      },
      {
        title: 'Düşük Sistem Oyunları 2026',
        slug: 'dusuk-sistem-oyunlari-2026',
        content: '<p>Düşük sistemli bilgisayarlar için en iyi oyunları derledik.</p><p>İşte eski bilgisayarınızda bile akıcı şekilde çalışacak oyunlar...</p>',
        excerpt: 'Eski bilgisayarınızda bile akıcı oynayabileceğiniz oyunlar.',
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
        author: admin._id,
        category: 'guide',
        tags: ['dusuk-sistem', 'rehber', 'optimizasyon'],
        isFeatured: true
      },
      {
        title: 'FPS Arttırma Rehberi 2026',
        slug: 'fps-arttirma-rehberi-2026',
        content: '<p>Oyunlarda FPS arttırmak için en etkili yöntemleri sizler için derledik.</p><h2>1. Grafik Ayarlarını Optimize Edin</h2><p>... </p>',
        excerpt: 'Oyunlarınızda FPS\'yi %50\'ye kadar arttıracak ipuçları.',
        coverImage: 'https://images.unsplash.com/photo-1556438064-2d76447b76c9?w=800',
        author: admin._id,
        category: 'optimization',
        tags: ['fps', 'optimizasyon', 'rehber', 'performans'],
        isFeatured: false
      },
      {
        title: 'Elden Ring İncelemesi',
        slug: 'elden-ring-inceleme',
        content: '<p>Elden Ring, FromSoftware ve George R.R. Martin işbirliğinin muhteşem bir ürünü...</p>',
        excerpt: 'FromSoftware\'in başyapıtı Elden Ring\'i tüm yönleriyle inceledik.',
        coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        author: admin._id,
        category: 'review',
        tags: ['elden-ring', 'inceleme', 'rpg', 'souls-like'],
        isFeatured: false
      }
    ]);

    console.log('✅ Seed verileri başarıyla eklendi!');
    console.log('📧 Admin: admin@wado.com / admin123');
    console.log(`🎮 Oyunlar: ${games.length} adet`);
    console.log(`📚 Bloglar: 4 adet`);
    console.log(`📂 Kategoriler: ${categories.length} adet`);

    process.exit(0);
  } catch (error) {
    console.error('Seed hatası:', error);
    process.exit(1);
  }
};

seed();
