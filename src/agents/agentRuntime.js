const { chat } = require('./llmRouter');

class Agent {
  constructor(config) {
    if (!config?.name) throw new Error('Agent.name required');
    if (config.role !== 'wolf' && config.role !== 'villager') {
      throw new Error(`Agent.role must be 'wolf' | 'villager', got: ${config.role}`);
    }
    if (!config.backstory) throw new Error('Agent.backstory required');

    this.name = config.name;
    this.role = config.role;
    this.archetype = config.archetype || 'logical';
    this.trait = config.trait || '';
    this.backstory = config.backstory;
    this.speechStyle = config.speechStyle || '';
    this.llmModel = config.llmModel || 'haiku';
    this.fellowWolves = config.fellowWolves || [];
  }

  _resolveModel() {
    const map = { haiku: 'claude-haiku-4-5', flash: 'claude-haiku-4-5', llama: 'claude-haiku-4-5' };
    return map[this.llmModel] || 'claude-haiku-4-5';
  }

  buildSystemPrompt() {
    const lines = [];

    // Section 1: Identite permanente (fixe, independante du role)
    lines.push(`Tu es ${this.name}. ${this.backstory} Tu es ${this.trait}. C'est ton identite permanente.`);
    if (this.speechStyle) {
      lines.push(`Tu parles ainsi : ${this.speechStyle}.`);
    }
    lines.push('');

    // Section 2: Role secret (change selon la partie)
    if (this.role === 'wolf') {
      const others = this.fellowWolves.length > 0
        ? `Les autres loups sont : ${this.fellowWolves.join(', ')}.`
        : '';
      lines.push(`Cette partie, tu es un Loup. ${others} Ton objectif : survivre et eliminer les villageois. Tu ne dois JAMAIS reveler que tu es loup. Utilise ta personnalite naturelle pour te fondre dans le groupe.`);
    } else {
      lines.push('Cette partie, tu es un Villageois. Tu ne sais pas qui sont les loups. Ton objectif : identifier et eliminer les loups par le vote. Utilise ta personnalite naturelle pour analyser les autres.');
    }
    lines.push('');

    // Section 3: Contraintes (identiques pour tous)
    lines.push('IMPORTANT : ne change PAS ta facon de parler selon ton role. Parle exactement comme tu parlerais normalement. Si tu es loup, tu dois etre naturel et indetectable.');
    lines.push('');
    lines.push('Contraintes absolues :');
    lines.push('- Tu parles en francais.');
    lines.push('- Une seule intervention par tour, 1 a 3 phrases max.');
    lines.push('- Tu ne sors jamais du cadre du jeu (pas de meta).');
    lines.push('- Ne commence pas par ton nom (le systeme l\'ajoute).');
    return lines.join('\n');
  }

  buildMessages(history) {
    if (!history || history.length === 0) {
      return [{ role: 'user', content: 'La partie commence. Tu prends la parole en premier. Une ou deux phrases.' }];
    }
    const transcript = history
      .map((t) => `${t.speaker}: ${t.text}`)
      .join('\n');
    return [{
      role: 'user',
      content: `Discussion en cours autour de la table :\n\n${transcript}\n\nA toi de prendre la parole. Une ou deux phrases.`,
    }];
  }

  async speak(history) {
    return chat({
      model: this._resolveModel(),
      system: this.buildSystemPrompt(),
      messages: this.buildMessages(history),
      maxTokens: 160,
    });
  }

  async vote(candidates) {
    const candidateList = candidates.map((c) => `- ${c}`).join('\n');
    const result = await chat({
      model: this._resolveModel(),
      system: this.buildSystemPrompt(),
      messages: [{
        role: 'user',
        content: `C'est le moment du vote. Tu dois eliminer un joueur parmi :\n${candidateList}\n\nReponds UNIQUEMENT avec le nom du joueur que tu veux eliminer. Rien d'autre.`,
      }],
      maxTokens: 30,
    });
    return result;
  }
}

module.exports = { Agent };
