import { browser } from '$app/environment';
import type { HttpMethod } from '@sveltejs/kit/types/private';

import { PORTRAITS_IMAGE_PATH } from '$lib/config';
import { report } from './log';

export const request = async <T>(
  url: string,
  method: HttpMethod = 'GET',
  body?: unknown
): Promise<T | null> => {
  try {
    const options: RequestInit = { method, headers: { 'content-type': 'application/json' } };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(url, options);
    return res.json();
  } catch (error) {
    report('request', error, url);
    return null;
  }
};

export function preloadImage({ id, image }: { id: string; image: string }) {
  if (browser) {
    const nextImage = new Image();
    nextImage.fetchPriority = 'low';
    nextImage.src = `${PORTRAITS_IMAGE_PATH}/${id}/${image}`;
  }
}
