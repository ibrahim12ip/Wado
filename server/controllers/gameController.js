const Game = require('../models/Game');
const slugify = require('slugify');

exports.getAllGames = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, sort, search, minMemory, maxSize, isOnline, tag } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (isOnline) filter.isOnline = isOnline === 'true';
    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search };
    if (minMemory) filter['systemRequirements.minimum.memory'] = { $gte: minMemory };

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { downloadCount: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'views') sortOption = { viewCount: -1 };

    const games = await Game.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Game.countDocuments(filter);

    res.json({ games, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Oyunlar getirilemedi', error: error.message });
  }
};

exports.getGameBySlug = async (req, res) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug');
    if (!game) return res.status(404).json({ message: 'Oyun bulunamadı' });

    game.viewCount += 1;
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Oyun getirilemedi' });
  }
};

exports.getFeaturedGames = async (req, res) => {
  try {
    const games = await Game.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Öne çıkan oyunlar getirilemedi' });
  }
};

exports.getTrendingGames = async (req, res) => {
  try {
    const games = await Game.find({ isTrending: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ downloadCount: -1 })
      .limit(10);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Trend oyunlar getirilemedi' });
  }
};

exports.getEditorPicks = async (req, res) => {
  try {
    const games = await Game.find({ isEditorPick: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ rating: -1 })
      .limit(10);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Editör seçimleri getirilemedi' });
  }
};

exports.getLowSpecGames = async (req, res) => {
  try {
    const games = await Game.find({ isLowSpec: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(12);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Düşük sistem oyunları getirilemedi' });
  }
};

exports.searchGames = async (req, res) => {
  try {
    const { q, category, minMemory, maxSize, isOnline, sort, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];
    if (category) filter.category = category;
    if (isOnline) filter.isOnline = isOnline === 'true';

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { downloadCount: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const games = await Game.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Game.countDocuments(filter);
    res.json({ games, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Arama hatası' });
  }
};

exports.incrementDownload = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } }, { new: true });
    res.json({ downloadCount: game.downloadCount });
  } catch (error) {
    res.status(500).json({ message: 'İndirme sayısı güncellenemedi' });
  }
};

exports.likeGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, { $inc: { likeCount: 1 } }, { new: true });
    res.json({ likeCount: game.likeCount });
  } catch (error) {
    res.status(500).json({ message: 'Beğeni hatası' });
  }
};
