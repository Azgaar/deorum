import { createParser, type ParsedEvent, type ReconnectInterval } from 'eventsource-parser';

import { OPENAI_API_KEY } from '$env/static/private';

const endpoint = 'https://api.openai.com/v1/chat/completions';
const model = 'gpt-3.5-turbo';
const temperature = 1;

export async function openAIStream(prompt: string) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      temperature,
      messages: [{ role: 'user', content: prompt }],
      stream: true
    })
  });

  let text = '';

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type !== 'event') return;

        const data = event.data;
        if (data === '[DONE]') {
          controller.close();
          return;
        }

        try {
          const json = JSON.parse(data);
          const content = json.choices[0].delta.content;
          if (content === undefined) return;

          text += content;
          if (!text.trim()) return; // remove leading whitespace

          const queue = encoder.encode(content);
          controller.enqueue(queue);
        } catch (e) {
          controller.error(e);
        }
      }

      const parser = createParser(onParse);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
}
