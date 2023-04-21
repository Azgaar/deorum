import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';
import { request } from '$lib/utils/requests';
import { getRandomNumber } from '$lib/utils/probability';
import { blankRace } from '$lib/data/races';

import type { ICharacter, IRace, TGender } from '$lib/types/api.types';

export const createRandomizer = (
  character: ICharacter,
  setItem: (updatedCharacter: ICharacter) => void,
  races: Map<string, IRace>
) => {
  const randomize = {
    name: async () => {
      const name = await getRandomName(character, races);
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

async function getRandomName(
  { race, gender }: { race: string; gender: string },
  races: Map<string, IRace>
) {
  try {
    const raceName = races.get(race)?.name || '';
    const url = `/api/names/ironarachne?quantity=1&race=${raceName}&type=${gender}`;
    const names = await request<string[]>(url);
    return names[0] || '';
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
