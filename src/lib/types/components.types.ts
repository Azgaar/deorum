import type { Role } from '$lib/config';

export interface ILink {
  id: string;
  key: string;
  to: string;
  reload?: boolean;
  prefetch?: boolean;
  variable?: string;
  roles?: Role[];
}

export type TUnits = 'metric' | 'imperial';
