const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  backgroundImage: { type: String, required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  link: { type: String, default: '' },
  buttonText: { type: String, default: 'İndir' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Slider', sliderSchema);
