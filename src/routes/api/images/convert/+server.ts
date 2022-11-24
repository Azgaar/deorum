import type { RequestHandler } from '@sveltejs/kit';
import { Readable, PassThrough } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import { path } from '@ffmpeg-installer/ffmpeg';

import { createServerError } from '$lib/utils/errors';

ffmpeg.setFfmpegPath(path);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { buffer } = await request.json();
    const fileBuffer = Buffer.from(buffer as ArrayBuffer);
    console.log('Converter fileBuffer', fileBuffer);
    const stream = bufferToStream(fileBuffer);
    const output = await convertImage(stream, 'webp');
    console.log('Converter output', output);
    return new Response(output, { headers: { 'Content-Type': 'image/webp' } });
  } catch (err) {
    // report('characters', err);
    throw createServerError(err);
  }
};

function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable._read = function () {
    console.log('noop');
  };
  readable.push(buffer);
  readable.push(null);
  return readable;
}

function convertImage(stream: Readable, toFormat: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const passthrough = new PassThrough();

    ffmpeg()
      .input(stream)
      .outputFormat(toFormat)
      .on('error', reject)
      .stream(passthrough, { end: true });

    passthrough.on('data', (data) => chunks.push(data));
    passthrough.on('error', reject);
    passthrough.on('end', () => {
      const originalImage = Buffer.concat(chunks);
      const editedImage = originalImage.copyWithin(4, -4).slice(0, -4);
      return resolve(editedImage);
    });
  });
}
