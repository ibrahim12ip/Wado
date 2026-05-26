const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin', 'mod'], default: 'user' },
  badges: [{ type: String }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  gameRatings: [{
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    rating: { type: Number, min: 1, max: 10 }
  }],
  isBanned: { type: Boolean, default: false },
  bio: { type: String, default: '' },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
