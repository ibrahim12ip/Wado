const mongoose = require('mongoose');

const advertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['banner', 'video', 'sponsored', 'popup', 'sticky'], required: true },
  position: { type: String, enum: ['header', 'sidebar', 'content', 'footer', 'popup'], default: 'sidebar' },
  imageUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  linkUrl: { type: String, default: '' },
  script: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Advert', advertSchema);
