import PocketBase from 'pocketbase';

import { URL } from '$lib/config';
import type { IPortrait } from '$lib/api.types';
import { changeableKeys, type IChange } from '$lib/editor.types';

const client = new PocketBase(URL);

export async function patchPortraits(
  selected: string[],
  portraitsMap: Map<string, IPortrait>,
  changes: IChange[]
) {
  const patches = [];
  for (const id of selected) {
    const portrait = portraitsMap.get(id);
    if (!portrait) continue;

    const patchData = getPatchData(changes, portrait);
    if (Object.keys(patchData).length) patches.push({ id, patchData });
  }

  const promises = patches.map(
    ({ id, patchData }) =>
      client.records.update('portraits', id, patchData) as unknown as Promise<IPortrait>
  );

  return Promise.all(promises);
}

function getPatchData(changes: IChange[], portrait: IPortrait) {
  const tempItem = structuredClone(portrait);

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

function getNewValue(
  operation: 'update' | 'add' | 'remove',
  oldValue: unknown,
  value: string | number
) {
  if (operation === 'update' || !Array.isArray(oldValue)) return value;
  if (operation === 'add') return [...oldValue, value];
  if (operation === 'remove') return oldValue.filter((item) => item !== value);
}

export function getChanges(model: IPortrait, current: IPortrait) {
  console.log({ model, current });
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
