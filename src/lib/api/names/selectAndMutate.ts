import { getRandomElement, weight } from '$lib/utils/probability';

const vowels = weight({
  A: 23,
  E: 12,
  I: 8,
  J: 6,
  O: 3,
  U: 1,
  Y: 1
});

const consonants = weight({
  B: 7,
  C: 9,
  D: 7,
  F: 6,
  G: 7,
  H: 6,
  J: 6,
  K: 10,
  L: 8,
  M: 13,
  N: 9,
  P: 4,
  Q: 1,
  R: 5,
  S: 8,
  T: 5,
  V: 4,
  Z: 2
});

export const selectAndMutate = (names: string[]) => {
  const source = getRandomElement(names);
  const firstLetter = source[0];
  const isVowel = vowels.includes(firstLetter);
  const replacement = isVowel ? getRandomElement(vowels) : getRandomElement(consonants);

  return source.replace(firstLetter, replacement);
};
