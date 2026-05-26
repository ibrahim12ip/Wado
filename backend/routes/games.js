const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

router.get('/', async (req, res) => {
  try {
    const { category, sort, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (category && category !== 'all') query.category = category;
    if (search) query.$text = { $search: search };

    let sortOption = { rating: -1 };
    if (sort === 'newest') sortOption = { year: -1, _id: -1 };
    if (sort === 'name') sortOption = { title: 1 };

    const games = await Game.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Game.countDocuments(query);

    res.json({ games, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const games = await Game.find().sort({ rating: -1 }).limit(10);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/editors-choice', async (req, res) => {
  try {
    const games = await Game.find({ editorChoice: true }).sort({ rating: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const game = new Game(req.body);
    const saved = await game.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Game deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
