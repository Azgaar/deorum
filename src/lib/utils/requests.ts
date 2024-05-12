import { browser } from '$app/environment';
import type { HttpMethod } from '@sveltejs/kit';
import { readDataStream } from 'ai';

const defaultHeaders = {
  'content-type': 'application/json',
  accept: 'application/json'
};

export let controller: AbortController | null = null;

// json requests only
export const request = async <T>(
  url: string,
  method: HttpMethod = 'GET',
  data?: Record<string, unknown>
): Promise<T> => {
  controller = new AbortController();
  const options: RequestInit = { method, headers: defaultHeaders, signal: controller.signal };
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
  onData: (dataChunk: string) => void,
  onComplete: () => void
) => {
  const abortController = new AbortController();
  const options: RequestInit = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
    signal: abortController.signal
  };

  const res = await fetch(url, options);
  if (!res.ok) throw new Error((await res.json()).message || res.statusText);

  const body = res.body;
  if (!body) return null;

  const reader = body.getReader();

  for await (const { type, value } of readDataStream(reader)) {
    if (type === 'error') {
      abortController.abort();
      return false;
    }
    if (abortController.signal.aborted) return false;
    if (type === 'text') onData(value);
  }

  onComplete();
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
