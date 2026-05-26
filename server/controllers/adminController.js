const Game = require('../models/Game');
const User = require('../models/User');
const Category = require('../models/Category');
const Slider = require('../models/Slider');
const Advert = require('../models/Advert');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const slugify = require('slugify');

// Oyun Yönetimi
exports.createGame = async (req, res) => {
  try {
    const gameData = req.body;
    gameData.slug = slugify(gameData.title, { lower: true, strict: true });
    const game = await Game.create(gameData);
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Oyun eklenemedi', error: error.message });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) return res.status(404).json({ message: 'Oyun bulunamadı' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Oyun güncellenemedi' });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Oyun silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Oyun silinemedi' });
  }
};

// Slider Yönetimi
exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ order: 1 }).populate('game', 'title slug');
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: 'Slider getirilemedi' });
  }
};

exports.createSlider = async (req, res) => {
  try {
    const slider = await Slider.create(req.body);
    res.status(201).json(slider);
  } catch (error) {
    res.status(500).json({ message: 'Slider eklenemedi' });
  }
};

exports.updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(slider);
  } catch (error) {
    res.status(500).json({ message: 'Slider güncellenemedi' });
  }
};

exports.deleteSlider = async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slider silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Slider silinemedi' });
  }
};

// Kullanıcı Yönetimi
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcılar getirilemedi' });
  }
};

exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı banlanamadı' });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ban kaldırılamadı' });
  }
};

exports.setUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Rol güncellenemedi' });
  }
};

// Reklam Yönetimi
exports.getAdverts = async (req, res) => {
  try {
    const adverts = await Advert.find().sort({ createdAt: -1 });
    res.json(adverts);
  } catch (error) {
    res.status(500).json({ message: 'Reklamlar getirilemedi' });
  }
};

exports.createAdvert = async (req, res) => {
  try {
    const advert = await Advert.create(req.body);
    res.status(201).json(advert);
  } catch (error) {
    res.status(500).json({ message: 'Reklam eklenemedi' });
  }
};

exports.updateAdvert = async (req, res) => {
  try {
    const advert = await Advert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(advert);
  } catch (error) {
    res.status(500).json({ message: 'Reklam güncellenemedi' });
  }
};

exports.deleteAdvert = async (req, res) => {
  try {
    await Advert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reklam silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Reklam silinemedi' });
  }
};

// Kategori Yönetimi
exports.createCategory = async (req, res) => {
  try {
    const data = req.body;
    data.slug = slugify(data.name, { lower: true, strict: true });
    const category = await Category.create(data);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Kategori eklenemedi' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Kategori güncellenemedi' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kategori silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Kategori silinemedi' });
  }
};

// Blog Yönetimi
exports.createBlog = async (req, res) => {
  try {
    const data = req.body;
    data.slug = slugify(data.title, { lower: true, strict: true });
    data.author = req.user._id;
    const blog = await Blog.create(data);
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Blog eklenemedi' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Blog güncellenemedi' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Blog silinemedi' });
  }
};

// Yorum Yönetimi
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'username avatar')
      .populate('game', 'title slug')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Yorumlar getirilemedi' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Yorum silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Yorum silinemedi' });
  }
};

// Dashboard İstatistikleri
exports.getDashboardStats = async (req, res) => {
  try {
    const totalGames = await Game.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalDownloads = (await Game.aggregate([{ $group: { _id: null, total: { $sum: '$downloadCount' } } }]))[0]?.total || 0;
    const totalComments = await Comment.countDocuments();
    const recentGames = await Game.find().sort({ createdAt: -1 }).limit(5).select('title slug downloadCount viewCount createdAt');
    const popularGames = await Game.find().sort({ downloadCount: -1 }).limit(5).select('title slug downloadCount viewCount');

    res.json({ totalGames, totalUsers, totalDownloads, totalComments, recentGames, popularGames });
  } catch (error) {
    res.status(500).json({ message: 'İstatistikler getirilemedi' });
  }
};
