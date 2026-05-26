const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  title: { type: String, required: true },
  score: { type: Number, required: true, min: 0, max: 10 },
  author: { type: String, default: 'Wado Editör' },
  excerpt: String,
  content: String,
  image: String,
  pros: [String],
  cons: [String]
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
