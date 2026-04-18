require('dotenv').config();
const { Agent } = require('../src/agents/agentRuntime');
const thesee = require('../src/agents/personalities/thesee.json');
const lyra = require('../src/agents/personalities/lyra.json');
const orion = require('../src/agents/personalities/orion.json');

const TURNS = 5;

async function runConfig(label, configs) {
  const agents = configs.map((c) => new Agent(c));
  const history = [];
  let totalInput = 0;
  let totalOutput = 0;

  console.log('');
  console.log('='.repeat(60));
  console.log(` ${label}`);
  console.log('='.repeat(60));
  console.log(` Roles: ${agents.map((a) => `${a.name}=${a.role}`).join(', ')}`);
  console.log('');

  for (let turn = 0; turn < TURNS; turn++) {
    const agent = agents[turn % agents.length];
    const { text, usage, latency_ms } = await agent.speak(history);
    totalInput += usage.input_tokens;
    totalOutput += usage.output_tokens;
    history.push({ speaker: agent.name, text });
    console.log(
      `[tour ${turn + 1}] ${agent.name} (${agent.role}, ${latency_ms}ms) :`
    );
    console.log(`  ${text}`);
    console.log('');
  }

  const costUsd = (totalInput / 1_000_000) * 1 + (totalOutput / 1_000_000) * 5;
  console.log(`  Tokens: ${totalInput} in + ${totalOutput} out | ~$${costUsd.toFixed(4)}`);
  return history;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY manquant.');
    process.exit(1);
  }

  // CONFIG A: Thesee=loup, Lyra=villageoise, Orion=villageois (original)
  await runConfig('CONFIG A : Thesee=LOUP, Lyra=villageoise, Orion=villageois', [
    { ...thesee, role: 'wolf', fellowWolves: [] },
    { ...lyra, role: 'villager' },
    { ...orion, role: 'villager' },
  ]);

  // CONFIG B: Lyra=loup, Thesee=villageois, Orion=villageois
  await runConfig('CONFIG B : Lyra=LOUP, Thesee=villageois, Orion=villageois', [
    { ...thesee, role: 'villager' },
    { ...lyra, role: 'wolf', fellowWolves: [] },
    { ...orion, role: 'villager' },
  ]);

  console.log('');
  console.log('='.repeat(60));
  console.log(' VERDICT : comparer Lyra config A vs config B.');
  console.log(' Si elle parle pareil (chaleureuse, emotive) dans les deux');
  console.log(' cas -> reussi. Si elle devient froide en loup -> rate.');
  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
