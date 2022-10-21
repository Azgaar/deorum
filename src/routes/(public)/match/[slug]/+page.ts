export const load: import('./$types').PageLoad = async function ({ parent }) {
  const { current, next } = await parent();
  return { current, next };
};
