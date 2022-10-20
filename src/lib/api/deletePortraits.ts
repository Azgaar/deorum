import client from './client';

export async function deletePortraits(selected: string[]) {
  const promises = selected.map((id) => client.records.delete('portraits', id));
  return Promise.all(promises);
}
