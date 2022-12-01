import { weight, getRandomElement } from '$lib/utils/probability';
import { capitalizeEachWord } from '$lib/utils/string';

const isVowel = (letter: string) => /[aeiou]/i.test(letter);
const isConsonant = (letter: string) => /[bcdfghjklmnpqrstvwxyz]/i.test(letter);

const vowels = weight({
  a: 23,
  e: 12,
  i: 8,
  o: 3,
  u: 1,
  y: 1
});

const consonants = weight({
  b: 7,
  c: 9,
  d: 7,
  f: 6,
  g: 7,
  h: 6,
  j: 6,
  k: 10,
  l: 8,
  m: 13,
  n: 9,
  p: 4,
  q: 1,
  r: 5,
  s: 8,
  t: 5,
  v: 4,
  w: 1,
  z: 2
});

function mutateName(name: string, maxMutations: number): string {
  const mutated = name.toLocaleLowerCase().split('');
  let numReplaced = 0;

  for (let i = 0; i < name.length; i++) {
    if (numReplaced >= maxMutations) break;

    const char = name[i];

    if (isVowel(char) && Math.random() < 0.25) {
      mutated[i] = getRandomElement(vowels.filter((v) => v !== char));
      numReplaced++;
    } else if (isConsonant(char) && Math.random() < 0.5) {
      mutated[i] = getRandomElement(consonants.filter((c) => c !== char));
      numReplaced++;
    }
  }

  return capitalizeEachWord(mutated.join(''));
}

export function selectAndMutate(names: string[], maxMutations: number) {
  const source = getRandomElement(names);
  return mutateName(source, maxMutations);
}
