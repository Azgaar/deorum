export const load: import('./$types').PageServerLoad = async function ({ parent }) {
  const { items, currentId } = await parent();
  return { items, currentId };
};
