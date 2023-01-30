import { unique } from '$lib/utils/array';
import { makePOJO } from '$lib/utils/object';

import { changeableKeys, type IChange, type TEditorData } from '$lib/types/editor.types';
import type { IPortrait } from '$lib/types/api.types';

export function createFormData(editorData: TEditorData) {
  const formData = new FormData();
  for (const key of changeableKeys) {
    const value = editorData[key];

    if (Array.isArray(value)) {
      value.forEach((element) => formData.append(key, element));
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
}

export function getPatchData(changes: IChange[], portrait: IPortrait) {
  const tempItem = makePOJO(portrait);

  for (const { key, operation, value } of changes) {
    (tempItem[key] as unknown) = getNewValue(operation, tempItem[key], value);
  }

  const patchData: Partial<IPortrait> = {};
  for (const key of changeableKeys) {
    const oldValue = portrait[key];
    const newValue = tempItem[key];
    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) continue;
    (patchData[key] as unknown) = newValue;
  }

  return patchData;
}

export function getNewValue(
  operation: 'update' | 'add' | 'remove',
  oldValue: unknown,
  value: string | number | string[]
) {
  if (operation === 'update' || !Array.isArray(oldValue)) return value;

  if (!Array.isArray(value)) {
    if (operation === 'add') return [...oldValue, value];
    if (operation === 'remove') return oldValue.filter((item) => item !== value);
  } else {
    if (operation === 'add') return unique([...oldValue, ...value]);
    if (operation === 'remove') return oldValue.filter((item) => !value.includes(item));
  }
}

export function getChanges(model: TEditorData, current: TEditorData) {
  const changes: IChange[] = [];

  for (const key of changeableKeys) {
    const oldValue = model[key];
    const value = current[key];

    if (Array.isArray(value)) {
      if (!Array.isArray(oldValue)) throw 'Invalid type';

      for (const item of value) {
        if (!oldValue.includes(item)) {
          changes.push({ key, operation: 'add', value: item });
        }
      }

      for (const item of oldValue) {
        if (!value.includes(item)) {
          changes.push({ key, operation: 'remove', value: item });
        }
      }

      continue;
    }

    if (value !== oldValue) changes.push({ key, operation: 'update', value });
  }

  if (!changes.length) throw 'No changes';

  return changes;
}
