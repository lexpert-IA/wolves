const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { resolveUserId, requireAuth } = require('../middleware/firebaseAuth');
const User = require('../../db/models/User');

// -- Apply Firebase resolver globally
router.use(resolveUserId);

// -- Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'wolves', timestamp: new Date().toISOString() });
});

// ── Auth routes ─────────────────────────────────────────────────────────────

// GET /api/auth/me — returns the logged-in user's profile
router.get('/auth/me', requireAuth, (req, res) => {
  const u = req.dbUser;
  res.json({
    userId: u._id,
    username: u.username,
    email: u.email,
    balance: u.balance || 0,
    lockedBalance: u.lockedBalance || 0,
    totalBets: u.totalBets || 0,
    totalWon: u.totalWon || 0,
    totalLost: u.totalLost || 0,
    createdAt: u.createdAt,
  });
});

// GET /api/auth/check?username=xxx — check if username is available
router.get('/auth/check', async (req, res) => {
  const username = (req.query.username || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (username.length < 3) return res.json({ available: false });
  const exists = await User.findOne({ username }).lean();
  res.json({ available: !exists });
});

// POST /api/auth/firebase-register — create user profile after Firebase auth
router.post('/auth/firebase-register', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  if (!req.firebaseUser) {
    return res.status(401).json({ error: 'Token invalide' });
  }

  const { uid, email, firebase: fbInfo } = req.firebaseUser;
  const { username, refCode } = req.body;

  const clean = (username || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (clean.length < 3 || clean.length > 20) {
    return res.status(400).json({ error: 'Pseudo invalide (3-20 car.)' });
  }

  try {
    // Check if user already exists
    const existing = await User.findOne({ firebaseUid: uid });
    if (existing) {
      return res.json({
        userId: existing._id,
        username: existing.username,
        email: existing.email,
        balance: existing.balance || 0,
        lockedBalance: existing.lockedBalance || 0,
        totalBets: existing.totalBets || 0,
        totalWon: existing.totalWon || 0,
        totalLost: existing.totalLost || 0,
        createdAt: existing.createdAt,
      });
    }

    // Check username taken
    const taken = await User.findOne({ username: clean });
    if (taken) {
      return res.status(409).json({ error: 'Ce pseudo est déjà pris' });
    }

    // Determine auth provider
    const provider = fbInfo?.sign_in_provider === 'google.com' ? 'google'
      : fbInfo?.sign_in_provider === 'password' ? 'email'
      : 'anonymous';

    const user = await User.create({
      firebaseUid: uid,
      email: email || null,
      authProvider: provider,
      username: clean,
      balance: 1000, // Starting tokens (play money)
    });

    logger.info(`New user registered: ${clean} (${provider})`);

    res.json({
      userId: user._id,
      username: user.username,
      email: user.email,
      balance: user.balance,
      lockedBalance: 0,
      totalBets: 0,
      totalWon: 0,
      totalLost: 0,
      createdAt: user.createdAt,
    });
  } catch (err) {
    logger.error(`Register error: ${err.message}`);
    res.status(500).json({ error: 'Erreur serveur' });
  }
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
    const Character = require('../../db/models/Character');
    const { MatchEngine } = require('../engine/matchEngine');

    // Load random characters from DB (8 or 12)
    const count = parseInt(req.query.players) || 8;
    const characters = await Character.aggregate([{ $sample: { size: count } }]);

    if (characters.length < count) {
      return res.status(400).json({ error: `Pas assez de personnages en DB (${characters.length}/${count}). Lancez: node scripts/seedCharacters.js` });
    }

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

// -- Markets for a match
router.get('/matches/:id/markets', (req, res) => {
  try {
    const { getEngine } = require('../engine/matchEngine');
    const engine = getEngine(req.params.id);
    if (!engine) return res.status(404).json({ error: 'Match non trouvé ou terminé' });
    res.json({ markets: engine._marketsSnapshot() });
  } catch (err) {
    logger.error(`GET /matches/:id/markets error: ${err.message}`);
    res.status(500).json({ error: 'Internal error' });
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
