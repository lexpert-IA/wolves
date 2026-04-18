const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// -- Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'wolves', timestamp: new Date().toISOString() });
});

// -- Matches (placeholder pour S4)
router.get('/matches', async (req, res) => {
  try {
    const Match = require('../../db/models/Match');
    const matches = await Match.find().sort({ scheduledAt: -1 }).limit(20).lean();
    res.json(matches);
  } catch (err) {
    logger.error(`GET /matches error: ${err.message}`);
    res.status(500).json({ error: 'Internal error' });
  }
});

// -- Characters
router.get('/characters', async (req, res) => {
  try {
    const Character = require('../../db/models/Character');
    const characters = await Character.find().sort({ name: 1 }).lean();
    res.json(characters);
  } catch (err) {
    logger.error(`GET /characters error: ${err.message}`);
    res.status(500).json({ error: 'Internal error' });
  }
});

// -- Match events (live chat history for a match)
router.get('/matches/:matchId/events', async (req, res) => {
  try {
    const MatchEvent = require('../../db/models/MatchEvent');
    const events = await MatchEvent.find({ matchId: req.params.matchId })
      .sort({ timestamp: 1 })
      .lean();
    res.json(events);
  } catch (err) {
    logger.error(`GET /matches/:id/events error: ${err.message}`);
    res.status(500).json({ error: 'Internal error' });
  }
});

// -- Start a match
router.post('/matches/start', async (req, res) => {
  try {
    const { MatchEngine } = require('../engine/matchEngine');
    const thesee = require('../agents/personalities/thesee.json');
    const lyra = require('../agents/personalities/lyra.json');
    const orion = require('../agents/personalities/orion.json');
    const selene = require('../agents/personalities/selene.json');
    const fenris = require('../agents/personalities/fenris.json');
    const cassandra = require('../agents/personalities/cassandra.json');
    const hector = require('../agents/personalities/hector.json');
    const iris = require('../agents/personalities/iris.json');

    const characters = [thesee, lyra, orion, selene, fenris, cassandra, hector, iris];
    const engine = new MatchEngine(characters);

    // Start match in background (don't await — it runs for minutes)
    engine.start().catch((err) => {
      logger.error(`Match engine error: ${err.message}`);
    });

    // Poll until matchId is set (DB create takes a moment)
    for (let i = 0; i < 20; i++) {
      if (engine.matchId) break;
      await new Promise((r) => setTimeout(r, 500));
    }

    res.json({ matchId: engine.matchId, status: 'started' });
  } catch (err) {
    logger.error(`POST /matches/start error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// -- Get live match data (past events)
router.get('/matches/:id/live', async (req, res) => {
  try {
    const Match = require('../../db/models/Match');
    const MatchEvent = require('../../db/models/MatchEvent');

    const match = await Match.findById(req.params.id).lean();
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const events = await MatchEvent.find({ matchId: req.params.id })
      .sort({ timestamp: 1 })
      .lean();

    res.json({ match, events });
  } catch (err) {
    logger.error(`GET /matches/:id/live error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// -- Raw event details (LLM transparency)
router.get('/matches/:matchId/events/:eventId/raw', async (req, res) => {
  try {
    const MatchEvent = require('../../db/models/MatchEvent');
    const event = await MatchEvent.findOne({
      _id: req.params.eventId,
      matchId: req.params.matchId,
    }).lean();

    if (!event) return res.status(404).json({ error: 'Event not found' });

    const llm = event.metadata?.llm || null;
    res.json({
      eventId: event._id,
      type: event.type,
      actorName: event.metadata?.actorName,
      content: event.content,
      timestamp: event.timestamp,
      llm: llm ? {
        model: llm.model,
        modelLabel: llm.modelLabel,
        provider: llm.provider,
        latency_ms: llm.latency_ms,
        usage: llm.usage,
        systemPrompt: llm.systemPrompt,
        inputMessages: llm.inputMessages,
        rawResponse: llm.rawResponse,
      } : null,
    });
  } catch (err) {
    logger.error(`GET /events/:id/raw error: ${err.message}`);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
