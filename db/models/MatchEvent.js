const mongoose = require('mongoose');

const MatchEventSchema = new mongoose.Schema({
  matchId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  type:      { type: String, enum: ['chat', 'vote', 'elimination', 'phase_change', 'spectator_vote', 'system'], required: true },
  actorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Character', default: null },
  targetId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Character', default: null },
  content:   { type: String, default: '' },
  metadata:  { type: mongoose.Schema.Types.Mixed, default: {} },
});

MatchEventSchema.index({ matchId: 1, timestamp: 1 });

module.exports = mongoose.model('MatchEvent', MatchEventSchema);
