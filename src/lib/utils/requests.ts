import { browser } from '$app/environment';
import type { HttpMethod } from '@sveltejs/kit/types/private';

export const request = async <T>(
  url: string,
  method: HttpMethod = 'GET',
  data?: Record<string, unknown>
): Promise<T> => {
  const options: RequestInit = { method, headers: { 'content-type': 'application/json' } };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch(url, options);
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || res.statusText);
  return body;
};

export const postForm = async <T>(url: string, formData: FormData): Promise<T> => {
  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || res.statusText);
  return body;
};

export function preloadImage(src: string) {
  if (browser) {
    const nextImage = new Image();
    nextImage.fetchPriority = 'low';
    nextImage.src = src;
  }
}
