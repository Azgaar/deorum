export type TOpenEditorDialog = (
  title: string,
  entries: [string, string][],
  selected: string[],
  onSubmit: (newSelected: string[]) => void
) => void;

export type TOpenOriginalsDialog = (
  selected: string,
  onSubmit: (newOriginal: string) => void
) => void;

export const changeableKeys = ['original', 'quality', 'styles', 'colors', 'tags'] as const;
type TKey = typeof changeableKeys[number];

export interface IChange {
  key: TKey;
  operation: 'update' | 'add' | 'remove';
  value: string | number;
}

export type TPatchSelected = (changes: IChange[]) => Promise<void>;
