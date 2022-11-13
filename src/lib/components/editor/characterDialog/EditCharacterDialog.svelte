<script lang="ts">
  import Dialog, { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  import { t } from '$lib/locales/translations';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import NumberInput from '$lib/components/inputs/NumberInput.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import { request } from '$lib/utils/requests';
  import { blankRace } from '$lib/data/races';

  import Portraits from './portraits/Portraits.svelte';
  import RandomizeButton from '../RandomizeButton.svelte';

  import type { ICharacter, IRace, TGender } from '$lib/types/api.types';
  import { getRandomNumber } from '$lib/utils/probability';

  export let open: boolean;
  export let character: ICharacter;
  export let onSubmit: (character: ICharacter) => void;
  export let portraitIds: string[];

  export let races: Map<string, IRace>;
  export let archetypes: Map<string, { name: string }>;
  export let backgrounds: Map<string, { name: string }>;

  const createOptions = (map: Map<string, { name: string }>, category: string) => [
    ['', 'common.values.undefined'],
    ...Array.from(map).map(([value, { name }]) => [value, `common.${category}.${name}`])
  ];

  const genders = new Map(['male', 'female', 'non-binary'].map((v) => [v, { name: v }]));
  const genderOptions = createOptions(genders, 'genders');
  const raceOptions = createOptions(races, 'races');
  const archetypeOptions = createOptions(archetypes, 'archetypes');
  const backgroundOptions = createOptions(backgrounds, 'backgrounds');

  $: onOpen(open);
  let race: IRace = blankRace;
  let range: ReturnType<typeof getRange>;

  const onOpen = async (open: boolean) => {
    if (!open) return;
    race = races.get(character.race) || blankRace;
    range = getRange(race);
  };

  const randomizeName = async () => {
    const url = `/api/names/ironarachne?quantity=1&race=${character.race}&type=${character.gender}`;
    const names = await request<string[]>(url);
    character.name = names?.[0] || '';
  };

  const randomizeAge = () => {
    const age = getRandomNumber({
      mean: race.ageMean,
      deviation: race.ageDeviation,
      min: race.ageMin,
      max: race.ageMax
    });
    character.age = age;
  };

  const randomizeHeight = () => {
    const mean = deviateByGenre(race.heightMean, race.heightGenderDeviation);
    const height = getRandomNumber({ mean, deviation: race.heightDeviation });
    character.height = height;
  };

  const randomizeWeight = () => {
    const mean = deviateByGenre(race.weightMean, race.weightGenderDeviation);
    const weight = getRandomNumber({ mean, deviation: race.weightDeviation });
    character.weight = weight;
  };

  function deviateByGenre(initial: number, genderDeviation: number) {
    if (character.gender === 'male') return initial + genderDeviation;
    if (character.gender === 'female') return initial - genderDeviation;
    return initial;
  }

  function getRange(race: IRace) {
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

  const handleValueChange = (attribute: keyof ICharacter) => (value: number | string) => {
    (character[attribute] as string | number) = value;

    if (attribute === 'race') {
      race = races.get(value as string) || blankRace;
      range = getRange(race);
    }

    if (attribute === 'gender') range = getRange(race);
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const { id, name, age, gender, race, archetype, background, height, weight } = character;
    const portraits = portraitIds;

    const method = id ? 'PATCH' : 'PUT';
    const body = { id, name, age, gender, race, archetype, background, height, weight, portraits };
    const responseCharacter = await request<ICharacter>('/api/characters', method, body);

    if (responseCharacter) {
      onSubmit(responseCharacter);
      open = false;
    }
  };

  const handleCancel = () => {
    open = false;
  };
</script>

<Dialog
  bind:open
  class="dialog"
  aria-labelledby="character-editor"
  aria-describedby="character-editor"
  scrimClickAction=""
>
  <Title>
    {$t(character.id ? 'common.controls.edit' : 'common.controls.create')}
    {$t('admin.editor.character')}</Title
  >

  <form class="body" on:submit={handleSubmit}>
    <div class="content">
      <Portraits bind:ids={portraitIds} />

      <div class="columns">
        <div class="column">
          <div class="element">
            <div>{$t('common.character.gender')}:</div>
            <Select
              value={character.gender}
              options={genderOptions}
              onChange={handleValueChange('gender')}
            />
          </div>

          <div class="element">
            <div>{$t('common.character.race')}:</div>
            <Select
              value={character.race}
              options={raceOptions}
              onChange={handleValueChange('race')}
            />
          </div>

          <div class="element">
            <div>{$t('common.character.archetype')}:</div>
            <Select
              value={character.archetype}
              options={archetypeOptions}
              onChange={handleValueChange('archetype')}
            />
          </div>

          <div class="element">
            <div>{$t('common.character.background')}:</div>
            <Select
              value={character.background}
              options={backgroundOptions}
              onChange={handleValueChange('background')}
            />
          </div>
        </div>

        <div class="column">
          <div class="element">
            <div>{$t('common.character.name')}:</div>
            <div>
              <TextInput value={character.name} onChange={handleValueChange('name')} />
              <RandomizeButton onClick={randomizeName} />
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.age')}:</div>
            <div>
              <NumberInput value={character.age} onChange={handleValueChange('age')} />
              <span class="extent">{range?.age}</span>
              <RandomizeButton onClick={randomizeAge} />
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.height')}:</div>
            <div>
              <NumberInput value={character.height} onChange={handleValueChange('height')} />
              <span class="extent">{range?.height}</span>
              <RandomizeButton onClick={randomizeHeight} />
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.weight')}:</div>
            <div>
              <NumberInput value={character.weight} onChange={handleValueChange('weight')} />
              <span class="extent">{range?.weight}</span>
              <RandomizeButton onClick={randomizeWeight} />
            </div>
          </div>
        </div>
      </div>
    </div>

    <Actions>
      <Button type="button" style="color: white" on:click={handleCancel}>
        <Label>{$t('common.controls.cancel')}</Label>
      </Button>
      <Button type="submit" style="color: white">
        <Label>{$t('common.controls.apply')}</Label>
      </Button>
    </Actions>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  form.body {
    padding: 0 1.5rem;

    div.content {
      display: flex;
      flex-direction: column;
      gap: 4px;

      div.columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;

        div.column {
          display: flex;
          flex-direction: column;
          gap: 6px;

          div.element {
            display: grid;
            grid-template-columns: 1fr 2fr;
            align-items: center;
            gap: 4px;

            div {
              display: flex;
              align-items: center;
              gap: 2px;
            }

            span.extent {
              font-size: small;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
</style>
