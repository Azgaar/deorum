import { error, type HttpError } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

const isHttpError = (error: unknown): error is HttpError =>
  error instanceof Object && 'body' in error && 'status' in error;

export function normalizeError(err: unknown): string {
  if (typeof err === 'string') return err;
  if (err instanceof ClientResponseError) return err.data.message;
  if (isHttpError(err)) return err.body.message;
  if (err instanceof Error) return err.message;
  if (err instanceof Object) return err.toString();

  return 'An unknown error occurred';
}

function normalizeErrorCode(err: unknown): number {
  if (err instanceof ClientResponseError) return err.data.code || 500;
  if (isHttpError(err)) return err.status;
  return 500;
}

export const createServerError = (err: unknown) => {
  const code = normalizeErrorCode(err);
  const message = normalizeError(err);
  return error(code, message);
};

export const catchErrorDetails = (err: unknown) => {
  if (err instanceof ClientResponseError) return JSON.stringify(err);
  if (err instanceof Error) return err.stack;
  return err;
};
