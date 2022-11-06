import type { IPortrait, TGender } from './api.types';

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

export const changeableKeys = [
  'original',
  'quality',
  'styles',
  'colors',
  'tags',
  'name',
  'age',
  'gender',
  'race',
  'archetype',
  'background'
] as const;

export type TChangeableKey = typeof changeableKeys[number];

export type TEditorData = Pick<IPortrait, TChangeableKey>;

export interface IUploadedPortrait extends TEditorData {
  id: string;
  file: File;
  src: string;
}

export interface IChange {
  key: keyof TEditorData;
  operation: 'update' | 'add' | 'remove';
  value: string | number;
}

export type TPatchHandler = (changes: IChange[]) => Promise<void>;

export type TPostHandler = (editorData: TEditorData) => Promise<void>;

export type TDeleteHandler = () => Promise<void>;
