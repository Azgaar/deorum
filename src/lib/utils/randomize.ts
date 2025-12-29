import { NAME_GENERATOR_MODEL } from '$lib/config/story';
import { blankRace } from '$lib/data/races';
import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';
import { getRandomNumber } from '$lib/utils/probability';
import { request } from '$lib/utils/requests';

import type { ICharacter, IRace, TGender } from '$lib/types/api.types';

export const createRandomizer = (
  character: ICharacter,
  setItem: (updatedCharacter: ICharacter) => void,
  races: Map<string, IRace>,
  archetypes: Map<string, { name: string }>,
  backgrounds: Map<string, { name: string }>
) => {
  const randomize = {
    name: async () => {
      const name = await generateRandomName(character, races, archetypes, backgrounds);
      setItem({ ...character, name });
    },

    age: () => {
      const race = races.get(character.race) || blankRace;
      const age = getRandomNumber({
        mean: race.ageMean,
        deviation: race.ageDeviation,
        min: race.ageMin,
        max: race.ageMax
      });
      setItem({ ...character, age });
    },

    height: () => {
      const race = races.get(character.race) || blankRace;
      const mean = deviateByGenre(character.gender, race.heightMean, race.heightGenderDeviation);
      const height = getRandomNumber({ mean, deviation: race.heightDeviation });
      setItem({ ...character, height });
    },

    weight: () => {
      const race = races.get(character.race) || blankRace;
      const mean = deviateByGenre(character.gender, race.weightMean, race.weightGenderDeviation);
      const weight = getRandomNumber({ mean, deviation: race.weightDeviation });
      setItem({ ...character, weight });
    }
  };

  return randomize;
};

async function generateRandomName(
  character: ICharacter,
  races: Map<string, IRace>,
  archetypes: Map<string, { name: string }>,
  backgrounds: Map<string, { name: string }>
): Promise<string> {
  try {
    const race = races.get(character.race)?.name || '';
    const gender = character.gender || '';
    const archetype = archetypes.get(character.archetype)?.name || '';
    const background = backgrounds.get(character.background)?.name || '';

    const response = await request<{ name: string }>('/api/names/generate', 'POST', {
      race,
      gender,
      archetype,
      background,
      model: NAME_GENERATOR_MODEL
    });
    return response.name || character.name || '';
  } catch (err) {
    report('character editor', err);
    toastError(err);
    return '';
  }
}

function deviateByGenre(gender: '' | TGender, initial: number, genderDeviation: number) {
  if (gender === 'male') return initial + genderDeviation;
  if (gender === 'female') return initial - genderDeviation;
  return initial;
}
