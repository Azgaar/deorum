import { selectAndMutate } from '$lib/api/names/selectAndMutate';
import { humanFemaleNames } from './human-female';
import { humanMaleNames } from './human-male';

// human
// elf
// half-elf
// dwarf
// gnome
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
    male: INamesDataElement;
    female: INamesDataElement;
  };
}

interface INamesDataElement {
  names: string[]; // list of source names
  selected: number; // chance to just select a random name from the list, not generate
  method: (names: string[]) => string; // generation function
}

export const namesData: INamesData = {
  human: {
    male: {
      names: humanMaleNames,
      method: selectAndMutate,
      selected: 0.05 // 5%
    },
    female: {
      names: humanFemaleNames,
      method: selectAndMutate,
      selected: 0.05 // 5%
    }
  }
};
