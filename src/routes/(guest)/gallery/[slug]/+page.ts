export const load: import('./$types').PageLoad = async function ({ parent }) {
  const { items, currentId } = await parent();
  return { items, currentId };
};
