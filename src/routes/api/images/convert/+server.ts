import webp from 'webp-converter';
import type { RequestHandler } from '@sveltejs/kit';

import { createServerError } from '$lib/utils/errors';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const buffer = await request.arrayBuffer();
    console.log('Converter buffer', buffer);
    const fileBuffer = Buffer.from(buffer);
    console.log('Converter fileBuffer', fileBuffer);
    const output = await convertImage(fileBuffer);
    console.log('Converter output', output);
    return new Response(output, { headers: { 'Content-Type': 'image/webp' } });
  } catch (err) {
    // report('characters', err);
    throw createServerError(err);
  }
};

async function convertImage(buffer: Buffer): Promise<Buffer> {
  const promise = webp.buffer2webpbuffer(buffer, 'jpg', '-q 80', '/tmp/') as Promise<Buffer>;
  console.log('convertImage', promise);
  const result = await promise;
  console.log('convertImage', result);
  return result;
}
