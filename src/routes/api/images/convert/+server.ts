import type { RequestHandler } from '@sveltejs/kit';
import webp from 'webp-converter';

import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type');
    const imageType = contentType?.split('/')[1] ?? 'jpg';

    const buffer = await request.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const output = await convertImage(fileBuffer, imageType);

    const oldSize = fileBuffer.byteLength / 1024;
    const newSize = output.byteLength / 1024;
    const percent = Math.round((newSize / oldSize) * 100);

    log(
      'convert',
      `Converted ${imageType} to webp. Size reduced from ${oldSize.toFixed(2)} to ${newSize.toFixed(
        2
      )} kb (${percent}%)`
    );

    return new Response(output, { headers: { 'Content-Type': 'image/webp' } });
  } catch (err) {
    report('convert', err);
    throw createServerError(err);
  }
};

async function convertImage(buffer: Buffer, type: string): Promise<Buffer> {
  const promise = webp.buffer2webpbuffer(buffer, type, '-q 80', '/tmp/') as Promise<Buffer>;
  const result = await promise;
  return result;
}
