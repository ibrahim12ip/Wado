const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: 'Kullanıcı adı veya email zaten kullanılıyor' });

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username, email, role: user.role, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ message: 'Kayıt hatası', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    if (user.isBanned) return res.status(403).json({ message: 'Hesabınız banlanmış' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Hatalı şifre' });

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ message: 'Giriş hatası', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'title slug coverImage rating')
      .select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Profil getirme hatası' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { username, bio, avatar }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Profil güncelleme hatası' });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.favorites.includes(req.params.gameId)) {
      user.favorites.pull(req.params.gameId);
    } else {
      user.favorites.push(req.params.gameId);
    }
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Favori hatası' });
  }
};

exports.rateGame = async (req, res) => {
  try {
    const { rating } = req.body;
    const user = await User.findById(req.user._id);
    const existing = user.gameRatings.find(r => r.game.toString() === req.params.gameId);
    if (existing) existing.rating = rating;
    else user.gameRatings.push({ game: req.params.gameId, rating });
    await user.save();
    res.json({ gameRatings: user.gameRatings });
  } catch (error) {
    res.status(500).json({ message: 'Puanlama hatası' });
  }
};
