const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: String,
  content: String,
  image: String,
  category: { type: String, required: true },
  source: String,
  sourceUrl: String,
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
