import { browser } from '$app/environment';
import type { HttpMethod } from '@sveltejs/kit/types/private';

const defaultHeaders = {
  'content-type': 'application/json',
  accept: 'application/json'
};

// json requests only
export const request = async <T>(
  url: string,
  method: HttpMethod = 'GET',
  data?: Record<string, unknown>
): Promise<T> => {
  const options: RequestInit = { method, headers: defaultHeaders };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch(url, options);
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || res.statusText);
  return body;
};

// form data requests only
export const sendFormData = async <T>(
  url: string,
  formData: FormData,
  method: 'POST' | 'PATCH' | 'PUT'
): Promise<T> => {
  const res = await fetch(url, { method, body: formData });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || res.statusText);
  return body;
};

// stream requests only
export const stream = async (
  url: string,
  data: Record<string, unknown>,
  onData: (dataChunk: string) => void
) => {
  const options: RequestInit = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
  };

  const res = await fetch(url, options);
  if (!res.ok) throw new Error((await res.json()).message || res.statusText);

  const body = res.body;
  if (!body) return null;

  const reader = body.getReader();
  const decoder = new TextDecoder();

  const read = async () => {
    const { value, done } = await reader.read();
    if (done) return;
    const chunkValue = decoder.decode(value);
    onData(chunkValue);
    read();
  };
  await read();

  return true;
};

export function preloadImage(src: string) {
  if (browser) {
    const nextImage = new Image();
    nextImage.fetchPriority = 'low';
    nextImage.src = src;
  }
}

export async function toJson<T>(promise: Promise<Response>) {
  const response = await promise;
  return <T>response.json();
}
