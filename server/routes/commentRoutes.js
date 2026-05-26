const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');

router.get('/game/:gameId', async (req, res) => {
  try {
    const comments = await Comment.find({ game: req.params.gameId, isApproved: true })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Yorumlar getirilemedi' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { game, content, parentComment } = req.body;
    const comment = await Comment.create({ game, user: req.user._id, content, parentComment });
    const populated = await comment.populate('user', 'username avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Yorum eklenemedi' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Yorum bulunamadı' });
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Yetkiniz yok' });
    }
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Yorum silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Yorum silinemedi' });
  }
});

module.exports = router;
