import type { User } from 'pocketbase';

export interface ILocals {
  user: User | undefined;
}
