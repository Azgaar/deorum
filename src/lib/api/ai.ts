import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

import { ANTHROPIC_API_KEY, GROQ_API_KEY, OPENAI_API_KEY } from '$env/static/private';
import { models, type StoryModel } from '$lib/config/story';

const providers = {
  openai: createOpenAI({ apiKey: OPENAI_API_KEY }),
  anthropic: createAnthropic({ apiKey: ANTHROPIC_API_KEY }),
  groq: createOpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: GROQ_API_KEY })
};

export function getStoryModel(modelKey: StoryModel) {
  const modelConfig = models[modelKey];
  if (!modelConfig) throw new Error(`Model ${modelKey} is not supported`);

  const provider = providers[modelConfig.provider];
  return provider(modelKey);
}
