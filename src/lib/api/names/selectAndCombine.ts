import { getRandomElement } from '$lib/utils/probability';

export const selectAndCombine = (adjs: string[], nouns: string[]) => {
  const adj = getRandomElement(adjs);
  const noun = getRandomElement(nouns).toLowerCase();

  return `${adj}${noun}`;
};
