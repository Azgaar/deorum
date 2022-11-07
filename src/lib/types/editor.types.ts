import type { ICharacter, IPortrait } from './api.types';

export type TOpenEditorDialog = (
  key: string,
  entries: [string, { image: string; name: string }][],
  selected: string[],
  onSubmit: (newSelected: string[]) => void
) => void;

export type TOpenOriginalsDialog = (
  selected: string,
  onSubmit: (newOriginal: string) => void
) => void;

export type TOpenCharacterDialog = (
  character: ICharacter,
  onSubmit: (character: ICharacter) => void
) => void;

export const changeableKeys = [
  'original',
  'quality',
  'styles',
  'colors',
  'tags',
  'characters'
] as const;
export type TChangeableKey = typeof changeableKeys[number];

export interface IUploadedPortrait extends IPortrait {
  file: File;
  src: string;
}

export type TEditorData = IPortrait | IUploadedPortrait;

export interface IChange {
  key: TChangeableKey;
  operation: 'update' | 'add' | 'remove';
  value: string | number;
}

export type TPatchHandler = (changes: IChange[]) => Promise<void>;

export type TPostHandler = (editorData: TEditorData) => Promise<void>;

export type TDeleteHandler = () => Promise<void>;
