import { blankRace } from '$lib/data/races';
import type { IRace, TGender } from '$lib/types/api.types';

export function getRange(gender: '' | TGender, raceId: string, races: Map<string, IRace>) {
  function deviateByGender(initial: number, genderDeviation: number) {
    if (gender === 'male') return initial + genderDeviation;
    if (gender === 'female') return initial - genderDeviation;
    return initial;
  }

  const {
    heightMean,
    heightGenderDeviation,
    heightDeviation,
    weightMean,
    weightGenderDeviation,
    weightDeviation,
    ageMin,
    ageMax
  } = races.get(raceId) || blankRace;

  const heightMin = deviateByGender(heightMean, heightGenderDeviation) - heightDeviation;
  const heightMax = deviateByGender(heightMean, heightGenderDeviation) + heightDeviation;

  const weightMin = deviateByGender(weightMean, weightGenderDeviation) - weightDeviation;
  const weightMax = deviateByGender(weightMean, weightGenderDeviation) + weightDeviation;

  return {
    age: `[${ageMin}–${ageMax}]`,
    height: `[${heightMin}–${heightMax}]`,
    weight: `[${weightMin}–${weightMax}]`
  };
}
