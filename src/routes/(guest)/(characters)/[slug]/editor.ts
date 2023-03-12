import type { ICharacter, IRace } from '$lib/types/api.types';

export type IEditorData = {
  open: boolean;
  character: ICharacter;
  races: Map<string, IRace>;
  archetypes: Map<string, { name: string }>;
  backgrounds: Map<string, { name: string }>;
  tags: Map<string, { name: string; image: string }>;
};
