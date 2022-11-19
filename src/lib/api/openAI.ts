import { Configuration, OpenAIApi } from 'openai';

import { OPENAI_API_KEY } from '$env/static/private';

const MODEL = 'text-davinci-002';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.9;

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);
const options = { model: MODEL, max_tokens: MAX_TOKENS, temperature: TEMPERATURE };

export const requestStory = (prompt: string) => openai.createCompletion({ ...options, prompt });
