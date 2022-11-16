import { error } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

export function normalizeError(err: unknown): string {
  if (typeof err === 'string') return err;
  if (err instanceof ClientResponseError) return err.data.message;
  if (err instanceof Error) return err.message;
  if (err instanceof Object) return err.toString();

  return 'An unknown error occurred';
}

type TErrorWithStatus = { status: number };
const isStatusError = (error: unknown): error is TErrorWithStatus =>
  error instanceof Object && 'status' in error;

function normalizeErrorCode(err: unknown): number {
  if (err instanceof ClientResponseError) return err.data.code;
  if (isStatusError(err)) return err.status;
  return 500;
}

export const createServerError = (err: unknown) => {
  const code = normalizeErrorCode(err);
  const message = normalizeError(err);
  return error(code, { message });
};

export const catchErrorDetails = (err: unknown) => {
  if (err instanceof ClientResponseError) return JSON.stringify(err);
  if (err instanceof Error) return err.stack;
  return err;
};
