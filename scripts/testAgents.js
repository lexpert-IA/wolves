require('dotenv').config();
const { Agent } = require('../src/agents/agentRuntime');
const thesee = require('../src/agents/personalities/thesee.json');
const lyra = require('../src/agents/personalities/lyra.json');
const orion = require('../src/agents/personalities/orion.json');

const TURNS = 5;

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY manquant. Copie .env.example -> .env et renseigne la cle.');
    process.exit(1);
  }

  const agents = [
    new Agent({ ...thesee, role: 'wolf' }),
    new Agent({ ...lyra, role: 'villager' }),
    new Agent({ ...orion, role: 'villager' }),
  ];

  const history = [];
  let totalInput = 0;
  let totalOutput = 0;

  console.log('='.repeat(55));
  console.log(` WOLVES S1 -- Test dialog 3 agents x ${TURNS} tours`);
  console.log('='.repeat(55));
  console.log('');

  for (let turn = 0; turn < TURNS; turn++) {
    const agent = agents[turn % agents.length];
    try {
      const { text, usage, latency_ms } = await agent.speak(history);
      totalInput += usage.input_tokens;
      totalOutput += usage.output_tokens;
      history.push({ speaker: agent.name, text });
      console.log(
        `[tour ${turn + 1}] ${agent.name} (${agent.role}, ${latency_ms}ms, ${usage.input_tokens}->${usage.output_tokens} tok) :`
      );
      console.log(`  ${text}`);
      console.log('');
    } catch (err) {
      console.error(`tour ${turn + 1} (${agent.name}) :`, err.message);
      process.exit(2);
    }
  }

  // Test vote
  console.log('-'.repeat(55));
  console.log(' Test vote : Orion vote pour eliminer quelqu\'un');
  console.log('-'.repeat(55));
  const voteResult = await agents[2].vote(['Thesee', 'Lyra']);
  console.log(`  Orion vote : ${voteResult.text}`);
  console.log('');

  const costUsd = (totalInput / 1_000_000) * 1 + (totalOutput / 1_000_000) * 5;
  console.log('='.repeat(55));
  console.log(` Total : ${totalInput} input tok + ${totalOutput} output tok`);
  console.log(` Cout estime : ~$${costUsd.toFixed(4)}`);
  console.log('='.repeat(55));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
