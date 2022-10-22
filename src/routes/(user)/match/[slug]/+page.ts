export const load: import('./$types').PageLoad = async function ({ parent }) {
  const { current, next, tags } = await parent();
  return { current, next, tags };
};
