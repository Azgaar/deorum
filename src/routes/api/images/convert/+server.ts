import webp from 'webp-converter';
import type { RequestHandler } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type');
    const imageType = contentType?.split('/')[1] ?? 'jpg';

    const buffer = await request.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const output = await convertImage(fileBuffer, imageType);

    log(
      'Image conversion',
      `Converted ${imageType} to webp. Size reduced from ${fileBuffer.length} to ${output.length}`
    );
    return new Response(output, { headers: { 'Content-Type': 'image/webp' } });
  } catch (err) {
    report('Image conversion', err);
    throw createServerError(err);
  }
};

async function convertImage(buffer: Buffer, type: string): Promise<Buffer> {
  const promise = webp.buffer2webpbuffer(buffer, type, '-q 80', '/tmp/') as Promise<Buffer>;
  const result = await promise;
  return result;
}
