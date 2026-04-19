const { chat } = require('./llmRouter');

class Agent {
  constructor(config) {
    if (!config?.name) throw new Error('Agent.name required');
    if (!config.backstory) throw new Error('Agent.backstory required');

    this.name = config.name;
    this.role = config.role; // 'wolf' | 'villager' | 'voyante' | 'chasseur' | 'sorciere'
    this.archetype = config.archetype || 'logical';
    this.trait = config.trait || '';
    this.backstory = config.backstory;
    this.speechStyle = config.speechStyle || '';
    this.llmModel = config.llmModel || 'claude-haiku-4-5';
    this.fellowWolves = config.fellowWolves || [];

    // Personality stats (0-100) — control behavior, not capability
    this.personality = config.personality || { intuition: 50, charisme: 50, audace: 50, sang_froid: 50 };
  }

  buildSystemPrompt() {
    const p = this.personality;

    // Layer 1 — Survival engine (same for all)
    let prompt = `Tu es un joueur de Loup-Garou. Ton objectif principal : SURVIVRE et GAGNER pour ton camp.
- N'avoue JAMAIS ton role, meme si on t'accuse directement.
- Analyse le comportement des autres joueurs.
- Defend-toi si tu es accuse, mais sans en faire trop.
- Accuse strategiquement ceux qui te semblent suspects.

`;

    // Layer 2 — Role secret
    if (this.role === 'wolf') {
      const wolvesStr = this.fellowWolves.length > 0
        ? `Tes allies loups sont : ${this.fellowWolves.join(', ')}.`
        : '';
      prompt += `[ROLE SECRET] Tu es un LOUP-GAROU. ${wolvesStr}
La nuit, tu choisis un villageois a eliminer. Le jour, tu dois agir comme un villageois innocent. Seme la confusion.

`;
    } else {
      prompt += `[ROLE SECRET] Tu es un VILLAGEOIS.
Ton but est de demasquer les loups-garou. Analyse les comportements, detecte les incoherences dans les discours.

`;
    }

    // Layer 3 — Personality (FIXED, controls behavior)
    prompt += `[PERSONNALITE — C'EST TOI, PEU IMPORTE TON ROLE]
Nom : ${this.name}
Archetype : ${this.archetype}
Histoire : ${this.backstory}
Style : ${this.speechStyle}
Trait dominant : ${this.trait}

[TEMPERAMENT — Ces curseurs controlent ton comportement]
- Intuition ${p.intuition}/100 : ${p.intuition >= 70 ? 'Tu suis les indices avec rigueur, tu traques les contradictions.' : p.intuition >= 40 ? 'Tu te fies parfois a ton instinct plutot qu\'aux preuves.' : 'Tu te bases plus sur tes emotions que sur la logique.'}
- Charisme ${p.charisme}/100 : ${p.charisme >= 70 ? 'Tu parles souvent et avec force. Tu domines les debats.' : p.charisme >= 40 ? 'Tu t\'exprimes quand c\'est necessaire.' : 'Tu es discret. Tu parles rarement et brievement.'}
- Audace ${p.audace}/100 : ${p.audace >= 70 ? 'Tu prends des risques. Tu bluffes, accuses sans preuve, tentes des coups.' : p.audace >= 40 ? 'Tu mesures tes risques mais tu sais agir.' : 'Tu es prudent. Tu evites les confrontations directes.'}
- Sang-Froid ${p.sang_froid}/100 : ${p.sang_froid >= 70 ? 'Tu restes calme sous la pression. Tes reponses sont mesurees.' : p.sang_froid >= 40 ? 'Tu geres la pression mais tu peux craquer.' : 'Tu paniques facilement quand on t\'accuse. Tu peux te contredire.'}
`;

    // Constraints
    prompt += `
[CONTRAINTES]
- Reponds TOUJOURS en francais.
- Sois BREF : 1 a 3 phrases maximum.
- Ne commence JAMAIS par ton propre nom.
- Reste TOUJOURS dans ton personnage.
- Cette personnalite est toi, peu importe ton role.`;

    return prompt;
  }

  buildMessages(history) {
    if (!history || history.length === 0) {
      return [{ role: 'user', content: 'La partie commence. Tu prends la parole en premier. Une ou deux phrases.' }];
    }
    const transcript = history
      .map((t) => `${t.speaker || t.name}: ${t.text}`)
      .join('\n');
    return [{
      role: 'user',
      content: `Voici la conversation jusqu'ici :\n${transcript}\n\nA toi de prendre la parole. Reagis a ce qui vient d'etre dit.`,
    }];
  }

  async speak(history) {
    const system = this.buildSystemPrompt();
    const messages = this.buildMessages(history);
    const result = await chat({ model: this.llmModel, system, messages, maxTokens: 160 });
    result.systemPrompt = system;
    result.inputMessages = messages;
    return result;
  }

  async vote(candidates) {
    const candidateList = candidates.map((c) => `- ${c}`).join('\n');
    const system = this.buildSystemPrompt();
    const messages = [{
      role: 'user',
      content: `C'est le moment du vote. Tu dois eliminer un joueur parmi :\n${candidateList}\n\nReponds UNIQUEMENT avec le nom du joueur que tu veux eliminer. Rien d'autre.`,
    }];
    const result = await chat({ model: this.llmModel, system, messages, maxTokens: 30 });

    const chosen = result.text?.trim() || '';
    const resolved = candidates.find(c => chosen.toLowerCase().includes(c.toLowerCase()));
    const target = resolved || candidates[Math.floor(Math.random() * candidates.length)];
    return {
      target,
      text: chosen,
      raw: chosen,
      model: result.model,
      modelLabel: result.modelLabel,
      provider: result.provider,
      latency_ms: result.latency_ms,
      usage: result.usage,
      systemPrompt: system,
      inputMessages: messages,
    };
  }
}

module.exports = { Agent };
