const mongoose = require('mongoose');

const PlayerSubSchema = new mongoose.Schema({
  characterId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
  role:           { type: String, enum: ['wolf', 'villager'], required: true },
  alive:          { type: Boolean, default: true },
  eliminatedAt:   { type: Date, default: null },
  eliminatedPhase:{ type: String, default: null },
}, { _id: false });

const MatchSchema = new mongoose.Schema({
  status:       { type: String, enum: ['scheduled', 'active', 'completed'], default: 'scheduled', index: true },
  scheduledAt:  { type: Date, required: true },
  startedAt:    { type: Date, default: null },
  endedAt:      { type: Date, default: null },

  phase:        { type: String, enum: ['pre', 'day1', 'night1', 'day2', 'night2', 'day3', 'verdict'], default: 'pre' },
  phaseEndsAt:  { type: Date, default: null },

  players:      [PlayerSubSchema],
  winnerSide:   { type: String, enum: ['wolves', 'villagers'], default: null },

  spectatorCount:  { type: Number, default: 0 },
  totalBetVolume:  { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Match', MatchSchema);
