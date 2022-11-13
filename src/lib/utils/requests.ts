import { browser } from '$app/environment';
import type { HttpMethod } from '@sveltejs/kit/types/private';

import { PORTRAITS_IMAGE_PATH } from '$lib/config';

export const request = async <T>(
  url: string,
  method: HttpMethod = 'GET',
  data?: unknown
): Promise<T> => {
  const options: RequestInit = { method, headers: { 'content-type': 'application/json' } };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch(url, options);
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || res.statusText);
  return body;
};

export function preloadImage({ id, image }: { id: string; image: string }) {
  if (browser) {
    const nextImage = new Image();
    nextImage.fetchPriority = 'low';
    nextImage.src = `${PORTRAITS_IMAGE_PATH}/${id}/${image}`;
  }
}
