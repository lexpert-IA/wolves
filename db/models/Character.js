const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  archetype:   { type: String, required: true },
  group:       { type: String, enum: ['cerveaux', 'chaos', 'illusionnistes', 'electrons', 'silencieux', 'wildcards'], required: true },
  trait:       { type: String, required: true },
  backstory:   { type: String, required: true },
  speechStyle: { type: String, required: true },
  lorePublic:  { type: String, default: '' },
  llmModel:    { type: String, default: 'claude-haiku-4-5' },
  portraitUrl: { type: String, default: null },
  color:       { type: String, default: '#7c3aed' },

  personality: {
    intuition:  { type: Number, min: 0, max: 100, default: 50 },
    charisme:   { type: Number, min: 0, max: 100, default: 50 },
    audace:     { type: Number, min: 0, max: 100, default: 50 },
    sang_froid: { type: Number, min: 0, max: 100, default: 50 },
  },

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
