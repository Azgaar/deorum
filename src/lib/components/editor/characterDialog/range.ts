import { blankRace } from '$lib/data/races';
import type { IRace, TGender } from '$lib/types/api.types';

export function getRange(gender: '' | TGender, raceId: string, races: Map<string, IRace>) {
  function deviateByGenre(initial: number, genderDeviation: number) {
    if (gender === 'male') return initial + genderDeviation;
    if (gender === 'female') return initial - genderDeviation;
    return initial;
  }

  const race = races.get(raceId) || blankRace;

  const heightMin =
    deviateByGenre(race.heightMean, race.heightGenderDeviation) - race.heightDeviation;
  const heightMax =
    deviateByGenre(race.heightMean, race.heightGenderDeviation) + race.heightDeviation;

  const weightMin =
    deviateByGenre(race.weightMean, race.weightGenderDeviation) - race.weightDeviation;
  const weightMax =
    deviateByGenre(race.weightMean, race.weightGenderDeviation) + race.weightDeviation;

  return {
    age: `${race.ageMin} – ${race.ageMax}`,
    height: `${heightMin} – ${heightMax}`,
    weight: `${weightMin} – ${weightMax}`
  };
}
