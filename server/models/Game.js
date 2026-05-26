const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  story: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  screenshots: [{ type: String }],
  trailerUrl: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: String }],
  publisher: { type: String, default: '' },
  releaseDate: { type: Date },
  size: { type: String, default: '' },
  version: { type: String, default: '' },
  languages: [{ type: String }],
  hasTurkishPatch: { type: Boolean, default: false },
  isCompressed: { type: Boolean, default: false },
  isFullVersion: { type: Boolean, default: true },
  hasTorrent: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  isMultiplayer: { type: Boolean, default: false },
  isCoop: { type: Boolean, default: false },

  systemRequirements: {
    minimum: {
      os: { type: String, default: '' },
      processor: { type: String, default: '' },
      memory: { type: String, default: '' },
      graphics: { type: String, default: '' },
      storage: { type: String, default: '' },
      directx: { type: String, default: '' }
    },
    recommended: {
      os: { type: String, default: '' },
      processor: { type: String, default: '' },
      memory: { type: String, default: '' },
      graphics: { type: String, default: '' },
      storage: { type: String, default: '' },
      directx: { type: String, default: '' }
    }
  },

  downloadLinks: [{
    label: { type: String },
    url: { type: String },
    type: { type: String, enum: ['direct', 'torrent', 'part'] }
  }],

  installGuide: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },

  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isEditorPick: { type: Boolean, default: false },
  isLowSpec: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }]
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

gameSchema.index({ title: 'text', description: 'text', tags: 'text' });
gameSchema.index({ slug: 1 });
gameSchema.index({ category: 1 });
gameSchema.index({ isFeatured: 1, isTrending: 1 });

module.exports = mongoose.model('Game', gameSchema);
