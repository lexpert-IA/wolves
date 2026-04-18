const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // -- Firebase Auth
  firebaseUid:     { type: String, unique: true, sparse: true },
  email:           { type: String, sparse: true },
  authProvider:    { type: String, enum: ['google', 'email', 'anonymous'], default: 'email' },

  username:            { type: String },
  walletAddress:       { type: String },
  encryptedPrivateKey: { type: String, default: null },

  // -- Balances
  balance:       { type: Number, default: 0 },
  lockedBalance: { type: Number, default: 0 },

  // -- Stats
  totalBets:  { type: Number, default: 0 },
  totalWon:   { type: Number, default: 0 },
  totalLost:  { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

UserSchema.virtual('availableBalance').get(function() {
  return Math.max(0, (this.balance || 0) - (this.lockedBalance || 0));
});

module.exports = mongoose.model('User', UserSchema);
