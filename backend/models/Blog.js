const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  image: String,
  author: { type: String, default: 'Wado Editör' },
  authorImage: String,
  readTime: String,
  tags: [String],
  slug: String,
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
