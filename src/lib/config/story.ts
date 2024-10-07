export type StoryModel =
  | 'gpt-4o-mini'
  | 'gpt-4o'
  | 'gpt-4-turbo'
  | 'gpt-4'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-opus-20240229'
  | 'llama-3.2-90b-text-preview'
  | 'llama3-70b-8192';

export const DEFAULT_MODEL: StoryModel = 'gpt-4o-mini';

type ModelConfig = {
  provider: 'openai' | 'anthropic' | 'groq';
  label: string;
  description: string;
  price: number;
};

export const models: Record<StoryModel, ModelConfig> = {
  'gpt-4o-mini': {
    provider: 'openai',
    label: 'GPT-4o mini',
    description: 'common.models.description.gpt-4o-mini',
    price: 1 // 0.6$/1M tokens
  },
  'gpt-4o': {
    provider: 'openai',
    label: 'GPT-4o',
    description: 'common.models.description.gpt-4o',
    price: 5 // 10$/1M tokens
  },
  'gpt-4-turbo': {
    provider: 'openai',
    label: 'GPT-4 Turbo',
    description: 'common.models.description.gpt-4-turbo',
    price: 10 // 10$/1M tokens
  },
  'gpt-4': {
    provider: 'openai',
    label: 'GPT-4',
    description: 'common.models.description.gpt-4',
    price: 30 // 10$/1M tokens
  },
  'claude-3-sonnet-20240229': {
    provider: 'anthropic',
    label: 'Claude 3 Sonnet',
    description: 'common.models.description.claude-3-sonnet',
    price: 5
  },
  'claude-3-opus-20240229': {
    provider: 'anthropic',
    label: 'Claude 3 Opus',
    description: 'common.models.description.claude-3-opus',
    price: 25
  },
  'llama-3.2-90b-text-preview': {
    provider: 'groq',
    label: 'Llama 3.2 90B Vision Preview',
    description: 'common.models.description.llama-3.2-90b',
    price: 0
  },
  'llama3-70b-8192': {
    provider: 'groq',
    label: 'Llama 3 70B Groq',
    description: 'common.models.description.llama-3-70b',
    price: 0
  }
};

export const SYSTEM_PROMPT =
  'Act as a fantasy writer. Your aim is to write a creative story that has an outstanding plotline and unexpected climaxes. Avoid cliches and typos. Invent details, names and places as you want. Make each character unique. Write in present tense.';

export const sections = [
  { name: 'family origin', chance: 0.5, excludes: ['unusual family origin'] },
  { name: 'unusual family origin', chance: 0.4, excludes: ['family origin'] },
  { name: 'birthplace', chance: 0.2 },
  { name: 'family lifestyle', chance: 0.2 },
  { name: 'famous ancestor', chance: 0.15 },
  { name: 'family secrets', chance: 0.15 },
  { name: 'childhood home', chance: 0.1 },
  { name: 'childhood memories', chance: 0.2 },
  { name: 'early life', chance: 0.95 },
  { name: 'childhood friend', chance: 0.15 },
  { name: 'childhood trauma', chance: 0.15 },
  { name: 'education and training', chance: 0.15 },
  { name: 'mentor', chance: 0.15 },
  { name: 'later development', chance: 0.8 },
  { name: 'current occupation', chance: 0.95 },
  { name: 'guild membership', chance: 0.05 },
  { name: 'work motive', chance: 0.6 },
  { name: 'best friend', chance: 0.4 },
  { name: 'familiar or animal companion', chance: 0.05 },
  { name: 'allies', chance: 0.1 },
  { name: 'betrayals', chance: 0.1 },
  { name: 'enemy', chance: 0.2 },
  { name: 'enemies', chance: 0.05 },
  { name: 'enemies turned allies', chance: 0.05 },
  { name: 'romantic relationships', chance: 0.15 },
  { name: 'marriage', chance: 0.5 },
  { name: 'daughter', chance: 0.2 },
  { name: 'son', chance: 0.2 },
  { name: 'siblings', chance: 0.25 },
  { name: 'family relationships', chance: 0.15 },
  { name: 'fears', chance: 0.15 },
  { name: 'afraid of', chance: 0.2 },
  { name: 'personality', chance: 0.35 },
  { name: 'favorite food', chance: 0.1 },
  { name: 'life credo', chance: 0.8 },
  { name: 'morality', chance: 0.1 },
  { name: 'spiritual beliefs', chance: 0.15 },
  { name: 'political views', chance: 0.1 },
  { name: 'political intrigue', chance: 0.1 },
  { name: 'adventure', chance: 0.35 },
  { name: 'life-defining event', chance: 0.35 },
  { name: 'tragic events', chance: 0.1 },
  { name: 'achievements', chance: 0.1 },
  { name: 'nicknames and titles', chance: 0.3 },
  { name: 'language abilities', chance: 0.05 },
  { name: 'flaw', chance: 0.3 },
  { name: 'talent', chance: 0.35 },
  { name: 'crime', chance: 0.2 },
  { name: 'desire', chance: 0.1 },
  { name: 'hobby', chance: 0.1 },
  { name: 'favorite weapon', chance: 0.2 },
  { name: 'mannerism', chance: 0.25 },
  { name: 'quirks', chance: 0.15 },
  { name: 'habits', chance: 0.1 },
  { name: 'phobia', chance: 0.1 },
  { name: 'cultural customs', chance: 0.1 },
  { name: 'spellbook', chance: 0.1 },
  { name: 'famous quote', chance: 0.35 },
  { name: 'dream', chance: 0.35 },
  { name: 'regret', chance: 0.35 },
  { name: 'secret', chance: 0.35 },
  { name: 'tangled history', chance: 0.35 },
  { name: 'divine intervention', chance: 0.05 },
  { name: 'disability', chance: 0.15 },
  { name: 'health issues', chance: 0.1 },
  { name: 'favorite joke', chance: 0.15 },
  { name: 'favorite song', chance: 0.05 },
  { name: 'travel', chance: 0.15 },
  { name: 'favorite place', chance: 0.05 },
  { name: 'symbol', chance: 0.5 },
  { name: 'amulet', chance: 0.1 },
  { name: 'totem', chance: 0.05 },
  { name: 'magical artifacts', chance: 0.05 },
  { name: 'curses or blessings', chance: 0.05 }
];
