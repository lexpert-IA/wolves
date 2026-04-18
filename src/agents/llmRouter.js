const Anthropic = require('@anthropic-ai/sdk').default;
const config = require('../../config');
const logger = require('../utils/logger');

let _anthropicClient = null;

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

const MODEL_LABELS = {
  'nvidia/nemotron-3-super-120b-a12b:free': 'Nemotron 120B · Nvidia',
  'nvidia/nemotron-3-nano-30b-a3b:free': 'Nemotron 30B · Nvidia',
  'arcee-ai/trinity-large-preview:free': 'Trinity · Arcee AI',
  'z-ai/glm-4.5-air:free': 'GLM 4.5 · Zhipu AI',
  'claude-haiku-4-5': 'Claude Haiku · Anthropic',
};

function getAnthropicClient() {
  if (_anthropicClient) return _anthropicClient;
  const apiKey = config.anthropic.apiKey;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing');
  _anthropicClient = new Anthropic({ apiKey });
  return _anthropicClient;
}

async function chatAnthropic({ model, system, messages, maxTokens }) {
  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: model || 'claude-haiku-4-5',
    max_tokens: maxTokens,
    system,
    messages,
  });
  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join(' ')
    .trim();
  return {
    text,
    usage: {
      input_tokens: response.usage?.input_tokens ?? 0,
      output_tokens: response.usage?.output_tokens ?? 0,
    },
  };
}

async function chatOpenRouter({ model, system, messages, maxTokens }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY missing');

  const orMessages = [];
  if (system) {
    orMessages.push({ role: 'system', content: system });
  }
  for (const m of messages) {
    orMessages.push({ role: m.role, content: m.content });
  }

  const payload = JSON.stringify({
    model,
    messages: orMessages,
    max_tokens: maxTokens,
    temperature: 0.8,
  });
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': 'https://wolves.world',
    'X-Title': 'WOLVES',
  };

  let res;
  for (let attempt = 0; attempt < 4; attempt++) {
    res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: 'POST',
      headers,
      body: payload,
    });
    if (res.status !== 429) break;
    const wait = (attempt + 1) * 3000;
    logger.debug(`OpenRouter ${model} rate-limited, retry in ${wait}ms...`);
    await new Promise((r) => setTimeout(r, wait));
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter ${model} error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  let text = (data.choices?.[0]?.message?.content || '').trim();

  // Strip thinking tags (some models like DeepSeek wrap in <think>)
  text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  return {
    text,
    usage: {
      input_tokens: data.usage?.prompt_tokens || 0,
      output_tokens: data.usage?.completion_tokens || 0,
    },
  };
}

async function chat({ model, system, messages, maxTokens = 160 }) {
  const resolvedModel = model || 'claude-haiku-4-5';
  const t0 = Date.now();

  let result;
  let actualModel = resolvedModel;

  if (resolvedModel !== 'claude-haiku-4-5') {
    try {
      result = await chatOpenRouter({ model: resolvedModel, system, messages, maxTokens });
    } catch (err) {
      logger.warn(`OpenRouter ${resolvedModel} failed (${err.message}), falling back to claude-haiku-4-5`);
      actualModel = 'claude-haiku-4-5';
      result = await chatAnthropic({ model: actualModel, system, messages, maxTokens });
    }
  } else {
    result = await chatAnthropic({ model: resolvedModel, system, messages, maxTokens });
  }

  const latency_ms = Date.now() - t0;

  logger.debug(`LLM ${actualModel}: ${result.usage.output_tokens} tokens in ${latency_ms}ms`);

  return {
    text: result.text,
    usage: result.usage,
    model: actualModel,
    modelLabel: MODEL_LABELS[actualModel] || actualModel,
    latency_ms,
    provider: actualModel === 'claude-haiku-4-5' ? 'anthropic' : 'openrouter',
  };
}

module.exports = { chat, MODEL_LABELS };
