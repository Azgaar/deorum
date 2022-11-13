import type { IPortrait } from '$lib/types/api.types';
import { changeableKeys, type IChange, type TEditorData } from '$lib/types/editor.types';
import { unique } from '$lib/utils/array';
import { log } from '$lib/utils/log';
import { makePOJO } from '$lib/utils/object';
import { pluralize } from '$lib/utils/string';
import admin from './admin';

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

  const characterChanges = changes.filter(({ key }) => key === 'characters');
  for (const { operation, value } of characterChanges) {
    const characterId = value as string;
    const character = await admin.records.getOne('characters', characterId);
    const portraits = getNewValue(operation, character.portraits, selected) as string[];
    await admin.records.update('characters', characterId, { portraits });
  }

  const promises = patches.map(
    ({ id, patchData }) =>
      admin.records.update('portraits', id, patchData, {
        expand: 'characters'
      }) as unknown as Promise<IPortrait>
  );

  log('editor', `Update ${pluralize('portrait', selected.length)} ${selected.join(', ')}`, changes);
  return Promise.all(promises);
}

function getPatchData(changes: IChange[], portrait: IPortrait) {
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

function getNewValue(
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
