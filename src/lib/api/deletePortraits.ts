import { log } from '$lib/utils/log';
import { pluralize } from '$lib/utils/string';
import admin from './admin';

export async function deletePortraits(selected: string[]) {
  const promises = selected.map((id) => admin.records.delete('portraits', id));
  log('editor', `Delete ${pluralize('portrait', selected.length)} ${selected.join(', ')}`);
  return Promise.all(promises);
}
