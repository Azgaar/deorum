import { charactersConfig } from '$lib/config';
import { REGISTRATION_BONUS } from '$lib/config/coins';
import type { ICharacter, IPortrait, IProfile, IRecord } from '$lib/types/api.types';
import { getGalleryItemData } from '$lib/utils/characters';
import { toJson } from '$lib/utils/requests';
import type { PageServerLoad } from './$types';

export const csr = false;

const RELEASE_DATE = '2023-08-13';
const LIKED_CHARACTERS_LIMIT = 36;

export const load: PageServerLoad = async ({ fetch }) => {
  const [characters, profiles, customCharacters, uploadedPortraits] = await Promise.all([
    toJson<ICharacter[]>(fetch(`/api/characters?expand=${charactersConfig.expand}`)),
    toJson<IProfile[]>(fetch(`/api/profiles?filter=created>="${RELEASE_DATE}"`)),
    toJson<ICharacter[]>(fetch(`/api/custom?filter=created>="${RELEASE_DATE}"`)),
    toJson<IPortrait[]>(fetch(`/api/portraits?filter=created>="${RELEASE_DATE}"&&user@=""`))
  ]);

  const charactersData = selectMostLikedCharacters(characters, LIKED_CHARACTERS_LIMIT);
  const profileData = { ...aggregateRecordsCreation(profiles), ...aggregateCoinsSpend(profiles) };
  const customCharacterData = aggregateRecordsCreation(customCharacters);
  const uploadedPortraitsData = aggregateRecordsCreation(uploadedPortraits);

  return {
    characters: charactersData,
    profiles: profileData,
    customCharacters: customCharacterData,
    uploadedPortraits: uploadedPortraitsData
  };
};

function selectMostLikedCharacters(characters: ICharacter[], limit: number) {
  const sorted = characters.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  const mostLiked = sorted.slice(0, limit).map(getGalleryItemData);
  const leastLiked = sorted.slice(-limit).map(getGalleryItemData);

  return { mostLiked, leastLiked };
}

function aggregateRecordsCreation(entries: IRecord[]) {
  const createdByDate = aggregateByCreationDate(entries);

  const lastWeekEntries = entries.filter(thisWeek);
  const averagePerDay = Math.floor(entries.length / createdByDate.length);
  const averageLastWeek = Math.floor(lastWeekEntries.length / 7);

  return { createdByDate, averagePerDay, averageLastWeek };
}

function aggregateByCreationDate(records: IRecord[]): [string, number][] {
  const aggregated: Record<string, number> = {};

  const currentDate = new Date();
  while (currentDate.getTime() >= new Date(RELEASE_DATE).getTime()) {
    const day = currentDate.toISOString().split('T')[0];
    aggregated[day] = 0;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // for each record increment the count for the date it was created
  for (const record of records) {
    const day = record.created.split(' ')[0];
    aggregated[day] += 1;
  }

  return Object.entries(aggregated);
}

function thisWeek({ created }: IRecord): boolean {
  const YESTERDAY = new Date().setDate(new Date().getDate() - 1);
  const WEEK_AGO = new Date().setDate(new Date().getDate() - 8);

  return new Date(created).getTime() >= WEEK_AGO && new Date(created).getTime() <= YESTERDAY;
}

function aggregateCoinsSpend(profiles: IProfile[]) {
  const lastWeekProfiles = profiles.filter(thisWeek);

  const spendingCoins = Math.floor((profiles.filter(spendsCoins).length / profiles.length) * 100);
  const spendingCoinsLastWeek = Math.floor(
    (lastWeekProfiles.filter(spendsCoins).length / lastWeekProfiles.length) * 100
  );

  return { spendingCoins, spendingCoinsLastWeek };
}

function spendsCoins(profile: IProfile): boolean {
  return profile.coins !== REGISTRATION_BONUS;
}
