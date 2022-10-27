import admin from './admin';

export async function deletePortraits(selected: string[]) {
  const promises = selected.map((id) => admin.records.delete('portraits', id));
  return Promise.all(promises);
}
