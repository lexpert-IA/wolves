const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  archetype:   { type: String, enum: ['manipulator', 'emotive', 'logical', 'troublemaker', 'discreet', 'leader'], required: true },
  trait:       { type: String, required: true },
  backstory:   { type: String, required: true },
  speechStyle: { type: String, required: true },
  llmModel:    { type: String, enum: ['haiku', 'flash', 'llama'], default: 'haiku' },
  portraitUrl: { type: String, default: null },

  stats: {
    gamesPlayed:      { type: Number, default: 0 },
    gamesWon:         { type: Number, default: 0 },
    timesWolf:        { type: Number, default: 0 },
    timesVillager:    { type: Number, default: 0 },
    timesEliminated:  { type: Number, default: 0 },
    avgSurvivalRound: { type: Number, default: 0 },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Character', CharacterSchema);
