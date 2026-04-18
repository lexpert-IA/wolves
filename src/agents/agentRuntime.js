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
    this.llmModel = config.llmModel || 'claude-haiku-4-5';
    this.fellowWolves = config.fellowWolves || [];
  }

  buildSystemPrompt() {
    const lines = [];

    // COUCHE 1 — Moteur de survie (identique pour tous)
    lines.push('Tu participes a un jeu de survie sociale avec d\'autres joueurs. Ton objectif principal : SURVIVRE et GAGNER. Si le groupe vote pour t\'eliminer, tu perds. Tu ne dois JAMAIS reveler ton role. Analyse ce que disent les autres. Defends-toi si on t\'accuse. Accuse les autres si tu as des soupcons. Sois strategique.');
    lines.push('');

    // COUCHE 2 — Role secret (assigne par partie)
    if (this.role === 'wolf') {
      const others = this.fellowWolves.length > 0
        ? ` Les autres loups sont : ${this.fellowWolves.join(', ')}.`
        : '';
      lines.push(`Tu es un LOUP.${others} Chaque nuit vous choisissez un villageois a eliminer. Le jour, tu dois te comporter naturellement et ne surtout pas eveiller les soupcons. Vote pour eliminer des villageois innocents.`);
    } else {
      lines.push('Tu es un VILLAGEOIS. Tu ne connais le role de personne. Observe les comportements, cherche les incoherences, et vote pour eliminer ceux que tu suspectes d\'etre loups.');
    }
    lines.push('');

    // COUCHE 3 — Personnalite (fixe, ne change jamais)
    lines.push(`Tu es ${this.name}. ${this.backstory} Tu parles toujours ${this.speechStyle}. Tu es ${this.trait}. Cette personnalite est toi, peu importe ton role.`);
    lines.push('');

    lines.push('Contraintes :');
    lines.push('- Tu parles en francais.');
    lines.push('- Une seule intervention par tour, 1 a 3 phrases max.');
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
    const systemPrompt = this.buildSystemPrompt();
    const msgs = this.buildMessages(history);
    const result = await chat({
      model: this.llmModel,
      system: systemPrompt,
      messages: msgs,
      maxTokens: 160,
    });
    result.systemPrompt = systemPrompt;
    result.inputMessages = msgs;
    return result;
  }

  async vote(candidates) {
    const candidateList = candidates.map((c) => `- ${c}`).join('\n');
    const systemPrompt = this.buildSystemPrompt();
    const msgs = [{
      role: 'user',
      content: `C'est le moment du vote. Tu dois eliminer un joueur parmi :\n${candidateList}\n\nReponds UNIQUEMENT avec le nom du joueur que tu veux eliminer. Rien d'autre.`,
    }];
    const result = await chat({
      model: this.llmModel,
      system: systemPrompt,
      messages: msgs,
      maxTokens: 30,
    });
    result.systemPrompt = systemPrompt;
    result.inputMessages = msgs;
    return result;
  }
}

module.exports = { Agent };
