const Category = require('../models/Category');
const Game = require('../models/Game');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Game.countDocuments({ category: cat._id, isActive: true });
        return { ...cat.toObject(), gameCount: count };
      })
    );
    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ message: 'Kategoriler getirilemedi' });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return res.status(404).json({ message: 'Kategori bulunamadı' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Kategori getirilemedi' });
  }
};

exports.getGamesByCategory = async (req, res) => {
  try {
    const { page = 1, limit = 12, sort } = req.query;
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: 'Kategori bulunamadı' });

    const filter = { category: category._id, isActive: true };
    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { downloadCount: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const games = await Game.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Game.countDocuments(filter);
    res.json({ games, category, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Kategori oyunları getirilemedi' });
  }
};
