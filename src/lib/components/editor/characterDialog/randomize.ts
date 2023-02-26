import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';
import { request } from '$lib/utils/requests';
import { getRandomNumber } from '$lib/utils/probability';
import { blankRace } from '$lib/data/races';

import type { IRace, TGender } from '$lib/types/api.types';

export const createRandomizer = <T extends { race: string; gender: '' | TGender }>(
  item: T,
  setItem: (updatedCharacter: T) => void,
  races: Map<string, IRace>
) => {
  const randomize = {
    name: async () => {
      const name = await getRandomName(item, races);
      setItem({ ...item, name });
    },

    age: () => {
      const race = races.get(item.race) || blankRace;
      const age = getRandomNumber({
        mean: race.ageMean,
        deviation: race.ageDeviation,
        min: race.ageMin,
        max: race.ageMax
      });
      setItem({ ...item, age });
    },

    height: () => {
      const race = races.get(item.race) || blankRace;
      const mean = deviateByGenre(item.gender, race.heightMean, race.heightGenderDeviation);
      const height = getRandomNumber({ mean, deviation: race.heightDeviation });
      setItem({ ...item, height });
    },

    weight: () => {
      const race = races.get(item.race) || blankRace;
      const mean = deviateByGenre(item.gender, race.weightMean, race.weightGenderDeviation);
      const weight = getRandomNumber({ mean, deviation: race.weightDeviation });
      setItem({ ...item, weight });
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
