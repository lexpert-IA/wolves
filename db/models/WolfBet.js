const mongoose = require('mongoose');

const WolfBetSchema = new mongoose.Schema({
  userId:    { type: String, required: true, index: true },
  matchId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  marketKey: { type: String, required: true },
  position:  { type: String, enum: ['yes', 'no'], required: true },
  amount:    { type: Number, required: true },
  odds:      { type: Number, required: true },
  payout:    { type: Number, default: null },
  status:    { type: String, enum: ['active', 'won', 'lost', 'refunded'], default: 'active', index: true },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WolfBet', WolfBetSchema);
