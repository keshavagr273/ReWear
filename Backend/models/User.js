const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:                 { type: String, required: true },
  email:                { type: String, required: true, unique: true },
  password:             { type: String, required: true },
  role:                 { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:               { type: String },
  // Community points balance (used for garment redemption)
  points:               { type: Number, default: 50 },
  createdAt:            { type: Date, default: Date.now },
  resetPasswordToken:   { type: String },
  resetPasswordExpires: { type: Date },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare plain password with hashed password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate a password reset token
userSchema.methods.generatePasswordReset = function () {
  const crypto = require('crypto');
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  return token;
};

module.exports = mongoose.model('User', userSchema);