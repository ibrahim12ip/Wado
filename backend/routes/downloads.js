const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

router.get('/', async (req, res) => {
  try {
    const { q, type, sort } = req.query;
    let filter = { $and: [{ downloadType: { $exists: true } }, { $or: [{ downloadType: 'free' }, { downloadType: 'paid' }, { downloadType: 'demo' }] }] };

    if (q) {
      filter.$and.push({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tags: { $regex: q, $options: 'i' } }
        ]
      });
    }

    if (type) {
      filter.$and.push({ downloadType: type });
    }

    let sortOption = { downloads: -1 };
    if (sort === 'name') sortOption = { title: 1 };
    else if (sort === 'date') sortOption = { createdAt: -1 };
    else if (sort === 'size') sortOption = { fileSize: 1 };

    const games = await Game.find(filter).sort(sortOption).limit(100).select('title image description tags downloads downloadType fileSize rating category');

    res.json({ success: true, count: games.length, data: games });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).select('title image description tags downloads downloadType fileSize rating category');
    if (!game) return res.status(404).json({ success: false, message: 'Game not found' });
    res.json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/track', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } }, { new: true });
    if (!game) return res.status(404).json({ success: false, message: 'Game not found' });
    res.json({ success: true, downloads: game.downloads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/top/downloaded', async (req, res) => {
  try {
    const games = await Game.find({ $or: [{ downloadType: 'free' }, { downloadType: 'paid' }, { downloadType: 'demo' }] })
      .sort({ downloads: -1 }).limit(10).select('title image downloads downloadType rating');
    res.json({ success: true, data: games });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
