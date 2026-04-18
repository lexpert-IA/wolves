const mongoose = require('mongoose');

const WolfMarketSchema = new mongoose.Schema({
  matchId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true, index: true },
  key:      { type: String, required: true },
  label:    { type: String, required: true },
  type:     { type: String, enum: ['main', 'identity', 'elimination', 'narrative'], default: 'main' },
  resolved: { type: Boolean, default: false },
  outcome:  { type: String, enum: ['yes', 'no'], default: null },
  totalYes: { type: Number, default: 0 },
  totalNo:  { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

WolfMarketSchema.index({ matchId: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('WolfMarket', WolfMarketSchema);
