import { selectAndCombine } from '$lib/api/names/selectAndCombine';
import { selectAndMutate } from '$lib/api/names/selectAndMutate';
import { getRandomElement } from '$lib/utils/probability';

import { dwarfClanAdj } from './dwarf-clan-adj';
import { dwarfClanNounAdj } from './dwarf-clan-noun';
import { dwarfFeMaleNames } from './dwarf-female';
import { dwarfMaleNames } from './dwarf-male';
import { gnomeFemaleNames } from './gnome-female';
import { gnomeMaleNames } from './gnome-male';
import { humanFemaleNames } from './human-female';
import { humanMaleNames } from './human-male';

// human +
// elf
// half-elf
// dwarf ?
// gnome ?
// orc
// half-orc
// goblin
// ogre
// draconid
// beastman
// feline
// lizardman
// firbolg
// pixie
// demon
// angel
// spirit
// jinn
// skeleton
// siren
// gargoyle
// golem
// cyborg
// triton
// demigod
// birdman
// humanoid
// ent
// insectoid
// centaur
// satyr

interface INamesData {
  [race: string]: {
    male: () => string;
    female: () => string;
    clan?: () => string;
    clanChance?: number;
  };
}

export const namesData: INamesData = {
  human: {
    male: () => selectAndMutate(humanMaleNames, true),
    female: () => selectAndMutate(humanFemaleNames, true),
    clanChance: 0
  },
  dwarf: {
    male: () => getRandomElement(dwarfMaleNames),
    female: () => getRandomElement(dwarfFeMaleNames),
    clan: () => selectAndCombine(dwarfClanAdj, dwarfClanNounAdj),
    clanChance: 1
  },
  gnome: {
    male: () => selectAndMutate(gnomeMaleNames, false),
    female: () => selectAndMutate(gnomeFemaleNames, false),
    clanChance: 0
  }
};
