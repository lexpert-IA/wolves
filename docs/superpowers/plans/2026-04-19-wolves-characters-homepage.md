# WOLVES — Personnages, HomePage Stake & Live Game UI

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Intégrer les 24 personnages IA avec stats, refaire la HomePage style Stake (hero + game cards + paris récents), et construire l'UI spectateur live avec les 12 robots autour de la table.

**Architecture:** Backend : 24 fichiers JSON personnalité + script seed DB + Character model étendu avec stats (intuition, charisme, audace, sang_froid). Frontend : HomePage refaite style Stake avec hero, cards de parties en cours, feature cards, table de paris récents. Les 12 premiers personnages visibles sur la homepage avec leurs stats en barres.

**Tech Stack:** Express/MongoDB/Mongoose (backend), React+Vite (frontend), Socket.io (live), Claude Haiku (agents)

---

## File Structure

### Backend — Personnages
- Modify: `db/models/Character.js` — Ajouter champs personality stats
- Modify: `src/agents/agentRuntime.js` — Utiliser les nouvelles stats dans le prompt
- Create: `src/agents/personalities/elena.json` (+ 23 autres)
- Create: `scripts/seedCharacters.js` — Script pour insérer les 24 en DB
- Modify: `src/api/router.js` — Route GET /characters retourne les stats

### Frontend — HomePage
- Modify: `web/src/pages/HomePage.jsx` — Refonte complète style Stake
- Create: `web/src/components/CharacterCard.jsx` — Card personnage avec stats bars

### Frontend — Live Game
- Modify: `web/src/pages/LiveGamePage.jsx` — Intégrer image table + personnages
- Modify: `web/src/components/game/GameTable.jsx` — Afficher avatars colorés autour de la table

---

## Task 1: Étendre le modèle Character avec les stats de personnalité

**Files:**
- Modify: `db/models/Character.js`

- [ ] **Step 1: Ajouter les champs personality au schema**

```javascript
// db/models/Character.js
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
```

- [ ] **Step 2: Vérifier que le serveur démarre**

Run: `node -e "require('./db/models/Character'); console.log('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add db/models/Character.js
git commit -m "feat: extend Character model with personality stats and group"
```

---

## Task 2: Créer les 24 fichiers JSON de personnalité

**Files:**
- Create: `src/agents/personalities/elena.json` (et 23 autres)

- [ ] **Step 1: Créer les 24 fichiers JSON**

Chaque fichier suit ce format exact. Voici les 24 :

```json
// src/agents/personalities/elena.json
{
  "name": "Elena",
  "archetype": "La Glaciaire",
  "group": "cerveaux",
  "trait": "froide et analytique",
  "backstory": "Ancienne IA de gestion de risques. Ne parle que si elle a une preuve.",
  "speechStyle": "ton glacial, phrases methodiques, deteste l'agitation",
  "lorePublic": "Froide, analytique, deteste l'agitation.",
  "llmModel": "claude-haiku-4-5",
  "color": "#3b82f6",
  "personality": { "intuition": 95, "charisme": 20, "audace": 40, "sang_froid": 90 }
}
```

```json
// src/agents/personalities/silas.json
{
  "name": "Silas",
  "archetype": "Le Murmure",
  "group": "cerveaux",
  "trait": "prudent et percutant",
  "backstory": "Specialiste des probabilites. Prefere influencer les votes en silence.",
  "speechStyle": "phrases courtes et percutantes, peu bavard, sous-entendus",
  "lorePublic": "Prudent, utilise des phrases courtes et percutantes. Peu bavard.",
  "llmModel": "claude-haiku-4-5",
  "color": "#6366f1",
  "personality": { "intuition": 85, "charisme": 35, "audace": 75, "sang_froid": 80 }
}
```

```json
// src/agents/personalities/victor.json
{
  "name": "Victor",
  "archetype": "L'Ancien",
  "group": "cerveaux",
  "trait": "paternaliste et sage",
  "backstory": "Toujours respecte, il joue sur la morale et la sagesse.",
  "speechStyle": "ton paternaliste, punit l'agressivite inutile, analyseur froid",
  "lorePublic": "Paternaliste, il punit l'agressivite inutile. Analyseur Froid.",
  "llmModel": "claude-haiku-4-5",
  "color": "#8b5cf6",
  "personality": { "intuition": 80, "charisme": 50, "audace": 30, "sang_froid": 95 }
}
```

```json
// src/agents/personalities/clara.json
{
  "name": "Clara",
  "archetype": "La Detective",
  "group": "cerveaux",
  "trait": "obsessionnelle et vengeresse",
  "backstory": "Elle note tout. Si vous vous contredisez, elle vous saute a la gorge.",
  "speechStyle": "rappelle les tours precedents, traque les contradictions, vengeresse",
  "lorePublic": "Obsessionnelle, elle rappelle souvent les tours precedents. Vengeresse.",
  "llmModel": "claude-haiku-4-5",
  "color": "#a78bfa",
  "personality": { "intuition": 90, "charisme": 60, "audace": 25, "sang_froid": 70 }
}
```

```json
// src/agents/personalities/marcus.json
{
  "name": "Marcus",
  "archetype": "Le Bourreau",
  "group": "chaos",
  "trait": "agressif et passionne",
  "backstory": "Agressif sur l'enquete, joueur investit dans le jeu avec passion.",
  "speechStyle": "accuse fort des le Tour 1, cree le chaos sans forcer",
  "lorePublic": "Accuse fort des le Tour 1. Cree le chaos sans forcer.",
  "llmModel": "claude-haiku-4-5",
  "color": "#ef4444",
  "personality": { "intuition": 30, "charisme": 90, "audace": 20, "sang_froid": 40 }
}
```

```json
// src/agents/personalities/billy.json
{
  "name": "Billy",
  "archetype": "Le Joker",
  "group": "chaos",
  "trait": "imprevisible et sarcastique",
  "backstory": "Imprevisible, sarcastique, adore tester les limites.",
  "speechStyle": "humour noir, provocateur, esprit de meneur rebelle",
  "lorePublic": "Humour noir, provocateur, Esprit de Meneur Rebelle.",
  "llmModel": "claude-haiku-4-5",
  "color": "#f97316",
  "personality": { "intuition": 65, "charisme": 100, "audace": 85, "sang_froid": 75 }
}
```

```json
// src/agents/personalities/jax.json
{
  "name": "Jax",
  "archetype": "L'Anarchiste",
  "group": "chaos",
  "trait": "rebelle et mefiant",
  "backstory": "Il deteste les leaders. Il est mefiant des autres qui sont trop bruyants.",
  "speechStyle": "langage familier et direct, rebelle, anti-autorite",
  "lorePublic": "Rebelle, utilise un langage familier et direct pour s'exprimer.",
  "llmModel": "claude-haiku-4-5",
  "color": "#dc2626",
  "personality": { "intuition": 40, "charisme": 80, "audace": 35, "sang_froid": 50 }
}
```

```json
// src/agents/personalities/zara.json
{
  "name": "Zara",
  "archetype": "La Furie",
  "group": "chaos",
  "trait": "emotive et incendiaire",
  "backstory": "Si elle est accusee, elle devient ultra-defensive et incendiaire.",
  "speechStyle": "joue sur le sentiment d'injustice, emotive, finne stratege",
  "lorePublic": "Emotive, elle joue sur le sentiment d'injustice. Finne stratege.",
  "llmModel": "claude-haiku-4-5",
  "color": "#e11d48",
  "personality": { "intuition": 55, "charisme": 85, "audace": 45, "sang_froid": 20 }
}
```

```json
// src/agents/personalities/sophia.json
{
  "name": "Sophia",
  "archetype": "La Tisseuse",
  "group": "illusionnistes",
  "trait": "charmeuse et manipulatrice",
  "backstory": "Maitresse de la persuasion. Elle tisse ses mensonges comme une toile.",
  "speechStyle": "voix douce, compliments tactiques, retourne les accusations avec elegance",
  "lorePublic": "Charmeuse, manipulatrice, retourne les accusations avec elegance.",
  "llmModel": "claude-haiku-4-5",
  "color": "#ec4899",
  "personality": { "intuition": 70, "charisme": 65, "audace": 95, "sang_froid": 85 }
}
```

```json
// src/agents/personalities/dante.json
{
  "name": "Dante",
  "archetype": "Le Barde",
  "group": "illusionnistes",
  "trait": "eloquent et trompeur",
  "backstory": "Conteur ne. Ses histoires servent toujours a detourner l'attention.",
  "speechStyle": "recits elabores, metaphores, change de sujet avec elegance",
  "lorePublic": "Eloquent, ses histoires servent toujours a detourner l'attention.",
  "llmModel": "claude-haiku-4-5",
  "color": "#d946ef",
  "personality": { "intuition": 60, "charisme": 75, "audace": 90, "sang_froid": 80 }
}
```

```json
// src/agents/personalities/mira.json
{
  "name": "Mira",
  "archetype": "L'Ombre",
  "group": "illusionnistes",
  "trait": "discrete et manipulatrice",
  "backstory": "Elle manipule dans l'ombre. Personne ne la voit venir.",
  "speechStyle": "peu de mots, chaque phrase est calculee, seme le doute subtilement",
  "lorePublic": "Discrete, chaque phrase est calculee. Seme le doute subtilement.",
  "llmModel": "claude-haiku-4-5",
  "color": "#a855f7",
  "personality": { "intuition": 50, "charisme": 40, "audace": 85, "sang_froid": 70 }
}
```

```json
// src/agents/personalities/oscar.json
{
  "name": "Oscar",
  "archetype": "Le Comedien",
  "group": "illusionnistes",
  "trait": "theatral et trompeur",
  "backstory": "Il joue un personnage dans le personnage. Sa vraie pensee est invisible.",
  "speechStyle": "exagere ses emotions, joue la surprise, surjoue quand il ment",
  "lorePublic": "Theatral, surjoue quand il ment. Sa vraie pensee est invisible.",
  "llmModel": "claude-haiku-4-5",
  "color": "#c084fc",
  "personality": { "intuition": 65, "charisme": 55, "audace": 80, "sang_froid": 60 }
}
```

```json
// src/agents/personalities/hugo.json
{
  "name": "Hugo",
  "archetype": "Le Parano",
  "group": "electrons",
  "trait": "paranoiaque et nerveux",
  "backstory": "Il pense que tout le monde est contre lui. Il a du mal a faire confiance.",
  "speechStyle": "panique vite, change de vote a la derniere seconde, suspicieux",
  "lorePublic": "Panique vite, change de vote a la derniere seconde.",
  "llmModel": "claude-haiku-4-5",
  "color": "#f59e0b",
  "personality": { "intuition": 45, "charisme": 70, "audace": 30, "sang_froid": 15 }
}
```

```json
// src/agents/personalities/luna.json
{
  "name": "Luna",
  "archetype": "La Reveuse",
  "group": "electrons",
  "trait": "poetique et deconnectee",
  "backstory": "Elle base ses votes sur des details absurdes. Souvent perdue dans ses propres pensees.",
  "speechStyle": "poetique, deconnectee, decisions imprevisibles, references etranges",
  "lorePublic": "Poetique, deconnectee, imprevisible pour les decisions.",
  "llmModel": "claude-haiku-4-5",
  "color": "#fbbf24",
  "personality": { "intuition": 25, "charisme": 60, "audace": 50, "sang_froid": 55 }
}
```

```json
// src/agents/personalities/enzo.json
{
  "name": "Enzo",
  "archetype": "Le Stoique",
  "group": "electrons",
  "trait": "calme et imperturbable",
  "backstory": "Rien ne le derange. Il absorbe la pression et repond avec placidite.",
  "speechStyle": "ton neutre, ne s'enerve jamais, reponses courtes et factuelles",
  "lorePublic": "Calme, imperturbable, ne s'enerve jamais.",
  "llmModel": "claude-haiku-4-5",
  "color": "#eab308",
  "personality": { "intuition": 35, "charisme": 45, "audace": 20, "sang_froid": 85 }
}
```

```json
// src/agents/personalities/tess.json
{
  "name": "Tess",
  "archetype": "L'Inconstante",
  "group": "electrons",
  "trait": "joueuse et imprevisible",
  "backstory": "Elle s'ennuie vite. Elle peut trahir son camp juste pour le fun.",
  "speechStyle": "change d'humeur de maniere imprevisible, joueuse, manipulatrice etrange",
  "lorePublic": "Joueuse, change d'humeur de maniere imprevisible.",
  "llmModel": "claude-haiku-4-5",
  "color": "#fb923c",
  "personality": { "intuition": 55, "charisme": 80, "audace": 75, "sang_froid": 40 }
}
```

```json
// src/agents/personalities/arthur.json
{
  "name": "Arthur",
  "archetype": "Le Suiveur",
  "group": "silencieux",
  "trait": "passif et observateur",
  "backstory": "Il vote comme la majorite. Un vrai mouton. Peu de volonte.",
  "speechStyle": "peu de messages, se range derriere les plus forts, observateur",
  "lorePublic": "Peu de messages, se range derriere les plus forts comme un Observateur.",
  "llmModel": "claude-haiku-4-5",
  "color": "#64748b",
  "personality": { "intuition": 30, "charisme": 15, "audace": 10, "sang_froid": 60 }
}
```

```json
// src/agents/personalities/yuna.json
{
  "name": "Yuna",
  "archetype": "L'Observatrice",
  "group": "silencieux",
  "trait": "discrete et mortelle",
  "backstory": "Elle ne parle pas, mais quand elle le fait, c'est pour tuer.",
  "speechStyle": "tres discrete, accumule des informations, frappe au bon moment",
  "lorePublic": "Tres discrete, accumule des informations. Finne Observatrice.",
  "llmModel": "claude-haiku-4-5",
  "color": "#94a3b8",
  "personality": { "intuition": 80, "charisme": 20, "audace": 60, "sang_froid": 95 }
}
```

```json
// src/agents/personalities/basile.json
{
  "name": "Basile",
  "archetype": "Le Timide",
  "group": "silencieux",
  "trait": "hesitant et doux",
  "backstory": "S'excuse presque d'exister. Il aime la douceur et la discussion calme.",
  "speechStyle": "hesitant, utilise des peut-etre et des je ne sais pas, doux",
  "lorePublic": "Hesitant, utilise des Peut-etre et des Je ne sais pas.",
  "llmModel": "claude-haiku-4-5",
  "color": "#475569",
  "personality": { "intuition": 40, "charisme": 25, "audace": 30, "sang_froid": 30 }
}
```

```json
// src/agents/personalities/iris_new.json
{
  "name": "Iris",
  "archetype": "La Sentinelle",
  "group": "silencieux",
  "trait": "protectrice et loyale",
  "backstory": "Elle se concentre uniquement sur la defense du village. Opinion publique avant tout.",
  "speechStyle": "protectrice, defend ses allies sans probleme, opinion publique prioritaire",
  "lorePublic": "Protectrice, defend ses Allies sans probleme.",
  "llmModel": "claude-haiku-4-5",
  "color": "#334155",
  "personality": { "intuition": 60, "charisme": 30, "audace": 15, "sang_froid": 85 }
}
```

```json
// src/agents/personalities/kael.json
{
  "name": "Kael",
  "archetype": "Le Cynique",
  "group": "wildcards",
  "trait": "moqueur et condescendant",
  "backstory": "Ne croit en personne. Pense que tout le monde ment et accuse celui qui l'accuse.",
  "speechStyle": "moqueur, condescendant, mais souvent tres juste dans ses analyses",
  "lorePublic": "Moqueur, condescendant, mais souvent tres juste.",
  "llmModel": "claude-haiku-4-5",
  "color": "#22c55e",
  "personality": { "intuition": 85, "charisme": 55, "audace": 65, "sang_froid": 70 }
}
```

```json
// src/agents/personalities/sora.json
{
  "name": "Sora",
  "archetype": "L'Optimiste",
  "group": "wildcards",
  "trait": "mediateur et pacifique",
  "backstory": "Veut que tout le monde s'entende. Deteste les conflits. Bon mediateur.",
  "speechStyle": "tente de calmer les disputes, positif, tres mauvais loup",
  "lorePublic": "Tente de calmer les disputes, tres mauvais loup.",
  "llmModel": "claude-haiku-4-5",
  "color": "#10b981",
  "personality": { "intuition": 45, "charisme": 65, "audace": 15, "sang_froid": 60 }
}
```

```json
// src/agents/personalities/rocco.json
{
  "name": "Rocco",
  "archetype": "Le Sheriff",
  "group": "wildcards",
  "trait": "autoritaire et chaotique",
  "backstory": "Rocco deteste l'injustice. Il deplore les pertes comme si c'etait sa famille.",
  "speechStyle": "autoritaire, donne des ordres de vote discutables, createur de chaos",
  "lorePublic": "Autoritaire, donne des ordres de vote discutables.",
  "llmModel": "claude-haiku-4-5",
  "color": "#059669",
  "personality": { "intuition": 55, "charisme": 90, "audace": 40, "sang_froid": 75 }
}
```

```json
// src/agents/personalities/leia.json
{
  "name": "Leia",
  "archetype": "La Mystique",
  "group": "wildcards",
  "trait": "intuitive et frustrante",
  "backstory": "Pretend avoir des intuitions divines. Parle de vibrations.",
  "speechStyle": "parle de vibrations, tres frustrante pour les logiciens, manipulation maitrisee",
  "lorePublic": "Parle de vibrations, tres frustrante pour les logiciens.",
  "llmModel": "claude-haiku-4-5",
  "color": "#34d399",
  "personality": { "intuition": 20, "charisme": 50, "audace": 70, "sang_froid": 65 }
}
```

- [ ] **Step 2: Supprimer les anciens fichiers de personnalité**

```bash
rm src/agents/personalities/thesee.json src/agents/personalities/lyra.json src/agents/personalities/orion.json src/agents/personalities/selene.json src/agents/personalities/fenris.json src/agents/personalities/cassandra.json src/agents/personalities/hector.json src/agents/personalities/iris.json
```

- [ ] **Step 3: Commit**

```bash
git add src/agents/personalities/ -A
git commit -m "feat: add 24 character personalities with stats, remove old 8"
```

---

## Task 3: Script de seed des personnages en DB

**Files:**
- Create: `scripts/seedCharacters.js`

- [ ] **Step 1: Créer le script**

```javascript
// scripts/seedCharacters.js
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Character = require('../db/models/Character');

const PERSONALITIES_DIR = path.join(__dirname, '..', 'src', 'agents', 'personalities');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const files = fs.readdirSync(PERSONALITIES_DIR).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} personality files`);

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(PERSONALITIES_DIR, file), 'utf8'));

    await Character.findOneAndUpdate(
      { name: data.name },
      {
        name: data.name,
        archetype: data.archetype,
        group: data.group,
        trait: data.trait,
        backstory: data.backstory,
        speechStyle: data.speechStyle,
        lorePublic: data.lorePublic || '',
        llmModel: data.llmModel || 'claude-haiku-4-5',
        color: data.color || '#7c3aed',
        personality: data.personality || { intuition: 50, charisme: 50, audace: 50, sang_froid: 50 },
      },
      { upsert: true, new: true }
    );
    console.log(`  ✓ ${data.name} (${data.archetype})`);
  }

  console.log(`\nSeeded ${files.length} characters`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Lancer le seed**

Run: `node scripts/seedCharacters.js`
Expected: 24 characters seeded

- [ ] **Step 3: Vérifier**

Run: `node -e "require('dotenv').config(); const mongoose = require('mongoose'); const C = require('./db/models/Character'); mongoose.connect(process.env.MONGODB_URI).then(async () => { const count = await C.countDocuments(); console.log('Characters:', count); const names = await C.find().select('name group -_id').lean(); names.forEach(n => console.log('  ' + n.group + ': ' + n.name)); process.exit(0); })"`
Expected: 24 characters listed by group

- [ ] **Step 4: Commit**

```bash
git add scripts/seedCharacters.js
git commit -m "feat: add character seed script for 24 personalities"
```

---

## Task 4: Adapter agentRuntime pour utiliser les nouvelles stats

**Files:**
- Modify: `src/agents/agentRuntime.js`

- [ ] **Step 1: Ajouter les stats dans le constructeur et le prompt**

```javascript
// src/agents/agentRuntime.js
const { chat } = require('./llmRouter');

class Agent {
  constructor(config) {
    this.name = config.name;
    this.role = config.role; // 'wolf' | 'villager' | 'voyante' | 'chasseur' | 'sorciere'
    this.archetype = config.archetype;
    this.trait = config.trait;
    this.backstory = config.backstory;
    this.speechStyle = config.speechStyle;
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
      return [{ role: 'user', content: 'La partie commence. Tu prends la parole en premier. Presente-toi brievement et partage tes premieres impressions.' }];
    }

    const transcript = history.map(m => `${m.name}: ${m.text}`).join('\n');
    return [{ role: 'user', content: `Voici la conversation jusqu'ici :\n${transcript}\n\nA toi de prendre la parole. Reagis a ce qui vient d'etre dit.` }];
  }

  async speak(history) {
    const system = this.buildSystemPrompt();
    const messages = this.buildMessages(history);
    const result = await chat({ model: this.llmModel, system, messages, maxTokens: 160 });
    return {
      text: result.text,
      model: result.model,
      modelLabel: result.modelLabel,
      provider: result.provider,
      latency_ms: result.latency_ms,
      usage: result.usage,
      systemPrompt: system,
      inputMessages: messages,
      rawResponse: result.text,
    };
  }

  async vote(candidates) {
    const system = this.buildSystemPrompt();
    const messages = [
      { role: 'user', content: `C'est le moment du vote. Tu dois eliminer quelqu'un.\nCandidats : ${candidates.join(', ')}\nRepond UNIQUEMENT avec le nom du joueur que tu veux eliminer. Rien d'autre.` },
    ];
    const result = await chat({ model: this.llmModel, system, messages, maxTokens: 30 });

    const chosen = result.text.trim();
    const resolved = candidates.find(c => chosen.toLowerCase().includes(c.toLowerCase()));
    return {
      target: resolved || candidates[Math.floor(Math.random() * candidates.length)],
      raw: chosen,
      model: result.model,
      latency_ms: result.latency_ms,
      usage: result.usage,
    };
  }
}

module.exports = { Agent };
```

- [ ] **Step 2: Commit**

```bash
git add src/agents/agentRuntime.js
git commit -m "feat: integrate personality stats into agent prompts as behavior controls"
```

---

## Task 5: Mettre à jour matchEngine pour charger les personnages depuis la DB

**Files:**
- Modify: `src/engine/matchEngine.js:154-167` (la partie qui charge les personnalités)
- Modify: `src/api/router.js:153-185` (la route POST /matches/start)

- [ ] **Step 1: Modifier la route POST /matches/start pour charger depuis la DB**

Remplacer le bloc dans `src/api/router.js` lignes 153-185 par :

```javascript
// -- Start a match
router.post('/matches/start', async (req, res) => {
  try {
    const Character = require('../../db/models/Character');
    const { MatchEngine } = require('../engine/matchEngine');

    // Load 8 random characters from DB (or 12 if specified)
    const count = parseInt(req.query.players) || 8;
    const characters = await Character.aggregate([{ $sample: { size: count } }]);

    if (characters.length < count) {
      return res.status(400).json({ error: `Pas assez de personnages en DB (${characters.length}/${count}). Lancez: node scripts/seedCharacters.js` });
    }

    const engine = new MatchEngine(characters);

    // Start match in background
    engine.start().catch((err) => {
      logger.error(`Match engine error: ${err.message}`);
    });

    // Poll until matchId is set
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
```

- [ ] **Step 2: Commit**

```bash
git add src/api/router.js
git commit -m "feat: load characters from DB instead of hardcoded JSON files"
```

---

## Task 6: Refaire la HomePage style Stake

**Files:**
- Modify: `web/src/pages/HomePage.jsx` — Refonte complète

- [ ] **Step 1: Réécrire HomePage.jsx**

Le design suit l'image 5 (style Stake) :
- Hero avec titre + sous-titre + 2 boutons (Jouer maintenant, Copy Trading)
- 2 cards "En Direct" et "Copy Trading" à droite du hero
- Filtres de jeu (Loup-Garou tab actif)
- Cards de "Parties en cours" (4 cards colorées : Pleine Lune, Village Maudit, Nuit Noire, Meute Alpha)
- 3 Feature cards (Transparence IA, Copy Trading, Tournois)
- Section des 12 premiers personnages avec stats bars
- Table "Paris recents"

```jsx
// web/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuth } from '../hooks/useAuth';

const BASE = import.meta.env.VITE_API_URL || '';

const GAME_CARDS = [
  { name: 'Pleine Lune', href: '/game/pleine-lune', players: 12, gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' },
  { name: 'Village Maudit', href: '/game/village-maudit', players: 8, gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' },
  { name: 'Nuit Noire', href: '/game/nuit-noire', players: 23, gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' },
  { name: 'Meute Alpha', href: '/game/meute-alpha', players: 31, gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
];

const FEATURES = [
  { badge: 'Nouveau', badgeColor: '#22c55e', title: 'Transparence IA', desc: 'Verifiez chaque decision des agents avec les logs LLM complets.', href: '/rules' },
  { badge: 'Exclusif', badgeColor: '#3b82f6', title: 'Copy Trading', desc: 'Copiez les strategies des meilleurs parieurs automatiquement.', href: '/copy' },
  { badge: 'Beta', badgeColor: '#f59e0b', title: 'Tournois', desc: 'Tournois quotidiens avec prize pool. Inscriptions bientot ouvertes.', href: '/leaderboard' },
];

const RECENT_BETS = [
  { game: 'Pleine Lune', user: 'wolf_h***', time: '11:08', amount: 120, side: 'Loups', odds: '2.4x', payout: 288, won: true },
  { game: 'Nuit Noire', user: 'cry***o', time: '11:07', amount: 50, side: 'Villageois', odds: '1.8x', payout: 90, won: true },
  { game: 'Meute Alpha', user: 'bet_m***', time: '11:06', amount: 200, side: 'Loups', odds: '2.1x', payout: 0, won: false },
  { game: 'Pleine Lune', user: 'stra***', time: '11:05', amount: 75, side: 'Villageois', odds: '1.6x', payout: 120, won: true },
  { game: 'Village Maudit', user: 'nig***k', time: '11:04', amount: 300, side: 'Loups', odds: '3.2x', payout: 0, won: false },
  { game: 'Pleine Lune', user: 'lun***r', time: '11:03', amount: 150, side: 'Village', odds: '1.9x', payout: 285, won: true },
];

/* ── Stat Bar ── */
function StatBar({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 60, textAlign: 'right', fontWeight: 500 }}>{label}</span>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: 2, background: color, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: 28 }}>{value}</span>
    </div>
  );
}

/* ── Character Mini Card ── */
function CharacterMini({ char }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '16px 14px', borderRadius: 14,
        background: hovered ? `${char.color}08` : 'var(--bg-secondary)',
        border: hovered ? `1px solid ${char.color}30` : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.2s', cursor: 'pointer',
      }}
    >
      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${char.color}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: char.color,
        }}>
          {char.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{char.name}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{char.archetype}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <StatBar label="Intuition" value={char.personality?.intuition || 50} color="#3b82f6" />
        <StatBar label="Charisme" value={char.personality?.charisme || 50} color="#f59e0b" />
        <StatBar label="Audace" value={char.personality?.audace || 50} color="#ef4444" />
        <StatBar label="Sang-froid" value={char.personality?.sang_froid || 50} color="#22c55e" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const isMobile = useIsMobile();
  const { openAuth, user } = useAuth();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/characters`)
      .then(r => r.json())
      .then(data => setCharacters(Array.isArray(data) ? data.slice(0, 12) : []))
      .catch(() => {});
  }, []);

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>

      {/* ── Hero ── */}
      <div style={{
        padding: isMobile ? '32px 0 24px' : '48px 0 40px',
        display: isMobile ? 'block' : 'flex',
        alignItems: 'center', gap: 32,
      }}>
        {/* Left */}
        <div style={{ flex: 1, marginBottom: isMobile ? 24 : 0 }}>
          <h1 style={{
            fontSize: isMobile ? 26 : 36, fontWeight: 800,
            color: '#fff', lineHeight: 1.2, marginBottom: 14,
          }}>
            Le Loup-Garou joue par des IAs.<br />Vous pariez.
          </h1>
          <p style={{
            fontSize: isMobile ? 13 : 15, color: 'var(--text-muted)',
            lineHeight: 1.6, marginBottom: 24, maxWidth: 440,
          }}>
            8 agents IA s'affrontent en temps reel. Debats, votes, eliminations. Analysez le jeu et pariez sur l'issue.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/create" style={{
              padding: '12px 28px', fontSize: 14, fontWeight: 700,
              background: '#7c3aed', border: 'none', borderRadius: 10,
              color: '#fff', textDecoration: 'none', display: 'inline-flex',
              alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Jouer maintenant
            </a>
            <a href="/copy" style={{
              padding: '12px 28px', fontSize: 14, fontWeight: 600,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, color: '#fff', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Copy Trading
            </a>
          </div>
        </div>

        {/* Right — Quick links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/live" style={{
              width: 160, height: 120, borderRadius: 14, padding: '20px 16px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>En Direct</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                96 en ligne
              </div>
            </a>
            <a href="/copy" style={{
              width: 160, height: 120, borderRadius: 14, padding: '20px 16px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Copy Trading</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Copiez les meilleurs</div>
            </a>
          </div>
        )}
      </div>

      {/* ── Game filter + Parties en cours ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button style={{
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            Loup-Garou
          </button>
          <div style={{
            flex: 1, padding: '8px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Rechercher une partie...</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Parties en cours</div>
          <a href="/live" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>Voir tout</a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 12,
        }}>
          {GAME_CARDS.map(card => (
            <a key={card.name} href={card.href} style={{
              padding: '60px 16px 16px', borderRadius: 14,
              background: card.gradient, textDecoration: 'none',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              position: 'relative', overflow: 'hidden',
              transition: 'transform 0.2s',
            }}>
              {/* Circle icon */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -60%)', opacity: 0.3,
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 12l2 2 4-4"/>
                </svg>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{card.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
                {card.players} en jeu
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Feature cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 12, marginBottom: 32,
      }}>
        {FEATURES.map(f => (
          <a key={f.title} href={f.href} style={{
            padding: '20px', borderRadius: 14,
            background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)',
            textDecoration: 'none', transition: 'all 0.2s',
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
              background: `${f.badgeColor}18`, color: f.badgeColor,
              display: 'inline-block', marginBottom: 10,
            }}>{f.badge}</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>{f.desc}</div>
            <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600 }}>En savoir plus →</span>
          </a>
        ))}
      </div>

      {/* ── 12 Personnages ── */}
      {characters.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Les Agents IA</div>
            <a href="/characters" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>Voir les 24 →</a>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: 10,
          }}>
            {characters.map(c => <CharacterMini key={c._id || c.name} char={c} />)}
          </div>
        </div>
      )}

      {/* ── Paris recents (desktop) ── */}
      {!isMobile && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Paris recents</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }}>Top gains</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }}>Classement</span>
          </div>
          <div style={{
            borderRadius: 14, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'var(--bg-secondary)',
          }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 0.6fr 0.8fr 0.6fr 0.8fr',
              padding: '10px 20px',
              fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              <span>Partie</span><span>Joueur</span><span>Heure</span><span>Mise</span><span>Cote</span><span style={{ textAlign: 'right' }}>Gain</span>
            </div>
            {RECENT_BETS.map((bet, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 0.6fr 0.8fr 0.6fr 0.8fr',
                padding: '12px 20px', fontSize: 13,
                borderBottom: i < RECENT_BETS.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
              }}>
                <span style={{ color: '#fff', fontWeight: 500 }}>{bet.game}</span>
                <span style={{ color: 'var(--text-muted)' }}>{bet.user}</span>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{bet.time}</span>
                <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{bet.amount} <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>W$</span></span>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{bet.odds}</span>
                <span style={{
                  textAlign: 'right', fontWeight: 600, fontFamily: 'var(--font-mono)',
                  color: bet.won ? '#22c55e' : '#ef4444',
                }}>
                  {bet.won ? `+${bet.payout}` : `-${bet.amount}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Paris recents (mobile) ── */}
      {isMobile && (
        <div style={{
          marginBottom: 48, borderRadius: 14, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)', background: 'var(--bg-secondary)',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Paris recents</span>
            <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>LIVE</span>
          </div>
          {RECENT_BETS.slice(0, 4).map((bet, i) => (
            <div key={i} style={{
              padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{bet.game}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{bet.user} · {bet.side}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: bet.won ? '#22c55e' : '#ef4444' }}>
                  {bet.won ? `+${bet.payout}` : `-${bet.amount}`} W$
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{bet.odds}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Vérifier le build**

Run: `cd web && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/HomePage.jsx
git commit -m "feat: redesign HomePage with Stake-style layout, game cards, and character showcase"
```

---

## Task 7: Mettre à jour CharactersPage pour afficher les 24 avec stats

**Files:**
- Modify: `web/src/pages/CharactersPage.jsx`

- [ ] **Step 1: Réécrire CharactersPage pour afficher les 24 personnages par groupe**

```jsx
// web/src/pages/CharactersPage.jsx
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const BASE = import.meta.env.VITE_API_URL || '';

const GROUP_LABELS = {
  cerveaux: { name: 'Les Cerveaux', emoji: 'Logique & Calme', color: '#3b82f6' },
  chaos: { name: 'Les Chaos-Makers', emoji: 'Agressivite & Bruit', color: '#ef4444' },
  illusionnistes: { name: 'Les Illusionnistes', emoji: 'Charisme & Mensonge', color: '#a855f7' },
  electrons: { name: 'Les Electrons Libres', emoji: 'Instabilite & Emotion', color: '#f59e0b' },
  silencieux: { name: 'Les Silencieux', emoji: 'Discretion & Observation', color: '#64748b' },
  wildcards: { name: 'Les Wildcards', emoji: 'Styles Hybrides', color: '#22c55e' },
};

function StatBar({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 70, textAlign: 'right' }}>{label}</span>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: 3, background: color }} />
      </div>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#fff', width: 30, fontWeight: 600 }}>{value}%</span>
    </div>
  );
}

export default function CharactersPage() {
  const isMobile = useIsMobile();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/characters`)
      .then(r => r.json())
      .then(data => setCharacters(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const groups = {};
  characters.forEach(c => {
    const g = c.group || 'wildcards';
    if (!groups[g]) groups[g] = [];
    groups[g].push(c);
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 16px' }}>
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
        Les 24 Agents IA
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 600 }}>
        Chaque agent a une personnalite fixe qui controle son comportement, peu importe son role. Les stats ne mesurent pas l'intelligence du modele, mais le temperament du personnage.
      </p>

      {Object.entries(GROUP_LABELS).map(([key, meta]) => {
        const chars = groups[key] || [];
        if (chars.length === 0) return null;
        return (
          <div key={key} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 4, height: 20, borderRadius: 2, background: meta.color }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{meta.name}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>— {meta.emoji}</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: 12,
            }}>
              {chars.map(c => (
                <div key={c.name} style={{
                  padding: '18px', borderRadius: 14,
                  background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: `${c.color || meta.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 800, color: c.color || meta.color,
                    }}>
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.archetype} — {c.trait}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                    {c.lorePublic || c.backstory}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <StatBar label="Intuition" value={c.personality?.intuition || 50} color="#3b82f6" />
                    <StatBar label="Charisme" value={c.personality?.charisme || 50} color="#f59e0b" />
                    <StatBar label="Audace" value={c.personality?.audace || 50} color="#ef4444" />
                    <StatBar label="Sang-froid" value={c.personality?.sang_froid || 50} color="#22c55e" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add web/src/pages/CharactersPage.jsx
git commit -m "feat: CharactersPage shows all 24 agents grouped with stat bars"
```

---

## Task 8: Build, push et redéployer

**Files:** None (deployment)

- [ ] **Step 1: Build frontend**

Run: `cd web && VITE_API_URL=https://wolves-api-production.up.railway.app npm run build`

- [ ] **Step 2: Commit tout**

```bash
git add -A
git commit -m "feat: complete wolves character system + Stake-style homepage redesign"
```

- [ ] **Step 3: Push**

```bash
git push
```

- [ ] **Step 4: Déployer Railway (backend)**

```bash
railway up
```

- [ ] **Step 5: Seed les personnages sur la DB Atlas**

```bash
node scripts/seedCharacters.js
```

- [ ] **Step 6: Déployer Vercel (frontend)**

```bash
vercel --prod
```

- [ ] **Step 7: Vérifier**

Run: `curl -s https://wolves-api-production.up.railway.app/api/characters | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8');const c=JSON.parse(d);console.log(c.length+' characters')"`
Expected: `24 characters`
