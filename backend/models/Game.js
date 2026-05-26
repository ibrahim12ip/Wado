const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true, index: 'text' },
  category: { type: String, required: true, enum: ['action', 'horror', 'open-world', 'racing', 'rpg', 'multiplayer', 'indie', 'survival'] },
  rating: { type: Number, default: 0, min: 0, max: 10 },
  year: Number,
  image: String,
  bg: String,
  description: String,
  features: [String],
  trailer: String,
  steam: String,
  epic: String,
  tags: [String],
  releaseDate: String,
  developer: String,
  sysReq: {
    min: { os: String, cpu: String, ram: String, gpu: String, storage: String },
    rec: { os: String, cpu: String, ram: String, gpu: String, storage: String }
  },
  downloads: { type: Number, default: 0 },
  downloadType: { type: String, enum: ['free', 'paid', 'demo'], default: 'paid' },
  fileSize: String,
  downloadUrl: String,
  officialSite: String,
  gog: String,
  editorChoice: { type: Boolean, default: false }
}, { timestamps: true });

gameSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Game', gameSchema);
