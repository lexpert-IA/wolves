const { Agent } = require('../agents/agentRuntime');
const Match = require('../../db/models/Match');
const MatchEvent = require('../../db/models/MatchEvent');
const { emitToMatch } = require('../utils/socket');
const logger = require('../utils/logger');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const WOLF_COUNT = 2;
const SPEECH_ROUNDS = 2;

class MatchEngine {
  constructor(characters, io) {
    this.characters = characters;
    this.io = io;
    this.matchId = null;
    this.agents = [];
    this.chatHistory = [];
    this.round = 0;
  }

  async start() {
    const shuffled = shuffle(this.characters);
    const wolfChars = shuffled.slice(0, WOLF_COUNT);
    const villagerChars = shuffled.slice(WOLF_COUNT);

    const wolfNames = wolfChars.map((c) => c.name);

    const wolfAgents = wolfChars.map((c) => new Agent({
      ...c,
      role: 'wolf',
      fellowWolves: wolfNames.filter((n) => n !== c.name),
    }));

    const villagerAgents = villagerChars.map((c) => new Agent({
      ...c,
      role: 'villager',
    }));

    this.agents = [...wolfAgents, ...villagerAgents];

    const match = await Match.create({
      status: 'active',
      scheduledAt: new Date(),
      startedAt: new Date(),
      phase: 'day1',
      players: this.agents.map((a) => ({
        characterName: a.name,
        role: a.role,
        alive: true,
      })),
    });
    this.matchId = match._id.toString();

    const publicPlayers = this.agents.map((a) => ({
      name: a.name,
      archetype: a.archetype,
      trait: a.trait,
      alive: true,
    }));

    emitToMatch(this.matchId, 'match_start', {
      matchId: this.matchId,
      players: publicPlayers,
    });

    await this._logEvent('system', null, null, 'La partie commence avec ' + this.agents.map((a) => a.name).join(', '));

    logger.info(`Match ${this.matchId} started: wolves=${wolfNames.join(',')}, villagers=${villagerChars.map((c) => c.name).join(',')}`);

    await this._gameLoop();
  }

  _livingAgents() {
    return this.agents.filter((a) => a._alive !== false);
  }

  _findAgent(name) {
    return this.agents.find((a) => a.name === name);
  }

  async _logEvent(type, actorName, targetName, content, metadata = {}) {
    return MatchEvent.create({
      matchId: this.matchId,
      type,
      actorId: null,
      targetId: null,
      content,
      metadata: { ...metadata, actorName, targetName },
    });
  }

  async _gameLoop() {
    while (true) {
      this.round++;

      await this.runDayPhase();

      const winner = this._checkWinner();
      if (winner) { await this.endMatch(winner); return; }

      const eliminated = await this.runVotePhase();

      const winnerAfterVote = this._checkWinner();
      if (winnerAfterVote) { await this.endMatch(winnerAfterVote); return; }

      await this.runNightPhase();

      const winnerAfterNight = this._checkWinner();
      if (winnerAfterNight) { await this.endMatch(winnerAfterNight); return; }
    }
  }

  _checkWinner() {
    const living = this._livingAgents();
    const wolves = living.filter((a) => a.role === 'wolf');
    const villagers = living.filter((a) => a.role === 'villager');

    if (wolves.length === 0) return 'villagers';
    if (villagers.length <= wolves.length) return 'wolves';
    return null;
  }

  async runDayPhase() {
    const phaseName = `day${this.round}`;

    emitToMatch(this.matchId, 'phase_change', {
      phase: 'day',
      round: this.round,
      phaseName,
    });

    await this._logEvent('phase_change', null, null, `Phase de jour ${this.round}`, { phase: phaseName });
    await sleep(2000);

    for (let speechRound = 0; speechRound < SPEECH_ROUNDS; speechRound++) {
      const speakers = shuffle(this._livingAgents());

      for (const agent of speakers) {
        try {
          const result = await agent.speak(this.chatHistory);
          this.chatHistory.push({ speaker: agent.name, text: result.text });

          const event = await this._logEvent('chat', agent.name, null, result.text, {
            llm: {
              model: result.model,
              modelLabel: result.modelLabel,
              provider: result.provider,
              latency_ms: result.latency_ms,
              usage: result.usage,
              systemPrompt: result.systemPrompt,
              inputMessages: result.inputMessages,
              rawResponse: result.text,
            },
          });

          emitToMatch(this.matchId, 'chat_message', {
            eventId: event._id.toString(),
            speaker: agent.name,
            text: result.text,
            round: this.round,
            speechRound: speechRound + 1,
            model: result.model,
            modelLabel: result.modelLabel,
          });

          await sleep(3000 + Math.random() * 2000);
        } catch (err) {
          logger.error(`Agent ${agent.name} speak error: ${err.message}`);
        }
      }
    }
  }

  async runVotePhase() {
    emitToMatch(this.matchId, 'phase_change', {
      phase: 'vote',
      round: this.round,
    });

    await this._logEvent('phase_change', null, null, `Phase de vote ${this.round}`, { phase: 'vote' });
    await sleep(2000);

    const living = this._livingAgents();
    const candidates = living.map((a) => a.name);
    const votes = {};

    for (const agent of living) {
      try {
        const result = await agent.vote(candidates.filter((n) => n !== agent.name));
        const votedFor = this._resolveVoteName(result.text, candidates.filter((n) => n !== agent.name));

        votes[agent.name] = votedFor;

        await this._logEvent('vote', agent.name, votedFor, `${agent.name} a vote`, {
          votedFor,
          llm: {
            model: result.model,
            modelLabel: result.modelLabel,
            provider: result.provider,
            latency_ms: result.latency_ms,
            usage: result.usage,
            systemPrompt: result.systemPrompt,
            inputMessages: result.inputMessages,
            rawResponse: result.text,
          },
        });

        emitToMatch(this.matchId, 'vote_cast', {
          voter: agent.name,
        });

        await sleep(1500);
      } catch (err) {
        logger.error(`Agent ${agent.name} vote error: ${err.message}`);
      }
    }

    const tally = {};
    for (const target of Object.values(votes)) {
      if (target) {
        tally[target] = (tally[target] || 0) + 1;
      }
    }

    let maxVotes = 0;
    let eliminated = null;
    for (const [name, count] of Object.entries(tally)) {
      if (count > maxVotes) {
        maxVotes = count;
        eliminated = name;
      }
    }

    await sleep(3000);

    if (eliminated) {
      const agent = this._findAgent(eliminated);
      if (agent) {
        agent._alive = false;

        await this._logEvent('elimination', null, eliminated, `${eliminated} a ete elimine par le vote du village`, { votes: tally, method: 'vote' });

        emitToMatch(this.matchId, 'vote_result', {
          eliminated: eliminated,
          tally,
        });

        emitToMatch(this.matchId, 'elimination', {
          name: eliminated,
          method: 'vote',
          round: this.round,
        });

        logger.info(`Match ${this.matchId}: ${eliminated} (${agent.role}) eliminated by vote`);
        return agent;
      }
    }

    return null;
  }

  _resolveVoteName(text, candidates) {
    const cleaned = text.trim();
    for (const c of candidates) {
      if (cleaned.toLowerCase() === c.toLowerCase()) return c;
    }
    for (const c of candidates) {
      if (cleaned.toLowerCase().includes(c.toLowerCase())) return c;
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  async runNightPhase() {
    emitToMatch(this.matchId, 'phase_change', {
      phase: 'night',
      round: this.round,
    });

    await this._logEvent('phase_change', null, null, `Phase de nuit ${this.round}`, { phase: 'night' });
    await sleep(3000);

    const living = this._livingAgents();
    const wolves = living.filter((a) => a.role === 'wolf');
    const villagers = living.filter((a) => a.role === 'villager');

    if (wolves.length === 0 || villagers.length === 0) return;

    const villagerNames = villagers.map((v) => v.name);
    const wolfVotes = {};

    for (const wolf of wolves) {
      try {
        const { text } = await wolf.vote(villagerNames);
        const chosenName = this._resolveVoteName(text, villagerNames);
        wolfVotes[wolf.name] = chosenName;
      } catch (err) {
        logger.error(`Wolf ${wolf.name} night vote error: ${err.message}`);
        wolfVotes[wolf.name] = villagerNames[Math.floor(Math.random() * villagerNames.length)];
      }
    }

    // Wolves agree on target — majority or first wolf decides
    const nightTally = {};
    for (const target of Object.values(wolfVotes)) {
      nightTally[target] = (nightTally[target] || 0) + 1;
    }

    let victimName = null;
    let maxNightVotes = 0;
    for (const [name, count] of Object.entries(nightTally)) {
      if (count > maxNightVotes) {
        maxNightVotes = count;
        victimName = name;
      }
    }

    const victim = this._findAgent(victimName) || villagers[0];

    await sleep(5000);

    victim._alive = false;

    await this._logEvent('elimination', null, victim.name, `${victim.name} a ete devore par les loups pendant la nuit`, { method: 'night_kill', wolfVotes });

    emitToMatch(this.matchId, 'night_kill', {
      victim: victim.name,
      round: this.round,
    });

    logger.info(`Match ${this.matchId}: ${victim.name} killed at night by wolves (${Object.keys(wolfVotes).join(',')})`);
  }

  async endMatch(winnerSide) {
    const roles = this.agents.map((a) => ({
      name: a.name,
      role: a.role,
      alive: a._alive !== false,
    }));

    await this._logEvent('system', null, null, `Partie terminee. Vainqueurs : ${winnerSide}`, { winnerSide, roles });

    emitToMatch(this.matchId, 'match_end', {
      winnerSide,
      roles,
      matchId: this.matchId,
    });

    await Match.findByIdAndUpdate(this.matchId, {
      status: 'completed',
      winnerSide,
      endedAt: new Date(),
    });

    logger.info(`Match ${this.matchId} ended: ${winnerSide} win!`);
    logger.info(`Roles: ${roles.map((r) => `${r.name}=${r.role}(${r.alive ? 'alive' : 'dead'})`).join(', ')}`);
  }
}

module.exports = { MatchEngine };
