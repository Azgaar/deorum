<script lang="ts">
  import Dialog, { Title } from '@smui/dialog';

  import { t } from '$lib/locales/translations';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import NumberInput from '$lib/components/inputs/NumberInput.svelte';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import { request } from '$lib/utils/requests';
  import { blankRace } from '$lib/data/races';
  import { genders } from '$lib/data/genders';
  import { getRandomNumber } from '$lib/utils/probability';
  import { report } from '$lib/utils/log';
  import { toastError } from '$lib/stores';

  import Portraits from './portraits/Portraits.svelte';
  import BiographyEditor from './biography/BiographyEditor.svelte';
  import TagsEditor from './tags/TagsEditor.svelte';
  import IconButton from '../IconButton.svelte';

  import type { IArchetype, IBackground, ICharacter, IRace } from '$lib/types/api.types';
  import type { TOpenEditorDialog } from '$lib/types/editor.types';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';

  export let open: boolean;
  export let character: ICharacter;
  export let onSubmit: (character: ICharacter) => void;
  export let onDelete: (characterId: string) => void;
  export let portraitIds: string[];

  export let races: Map<string, IRace>;
  export let archetypes: Map<string, { name: string }>;
  export let backgrounds: Map<string, { name: string }>;
  export let tags: Map<string, { name: string; image: string }>;

  export let openEditorDialog: TOpenEditorDialog;

  const createOptions = (map: Map<string, { name: string }>, category: string) => [
    ['', 'common.values.undefined'],
    ...Array.from(map).map(([value, { name }]) => [value, `common.${category}.${name}`])
  ];

  const genderOptions = createOptions(new Map(genders.map((v) => [v, { name: v }])), 'genders');
  const raceOptions = createOptions(races, 'races');
  const archetypeOptions = createOptions(archetypes, 'archetypes');
  const backgroundOptions = createOptions(backgrounds, 'backgrounds');

  $: onOpen(open);
  let race: IRace = blankRace;
  let range: ReturnType<typeof getRange>;
  let isLoading = false;

  const onOpen = async (open: boolean) => {
    if (!open) return;
    isLoading = false;
    race = races.get(character.race) || blankRace;
    range = getRange(race);
  };

  const randomizeName = async () => {
    try {
      const raceName = races.get(character.race)?.name || '';
      const url = `/api/names/ironarachne?quantity=1&race=${raceName}&type=${character.gender}`;
      const names = await request<string[]>(url);
      character.name = names[0] || '';
    } catch (err) {
      report('character editor', err);
      toastError(err);
      character.name = '';
    }
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
      character['@expand'].race = race;
      range = getRange(race);
    }

    if (attribute === 'archetype') {
      const archetype = archetypes.get(value as string);
      if (archetype) character['@expand'].archetype = archetype as IArchetype;
    }

    if (attribute === 'background') {
      const background = backgrounds.get(value as string);
      if (background) character['@expand'].background = background as IBackground;
    }

    if (attribute === 'gender') range = getRange(race);
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    try {
      isLoading = true;
      const { id, name, age, gender, race, archetype, background, height, weight, bio, tags } =
        character;
      const expand = 'race,archetype,background,portraits';
      const responseCharacter = await request<ICharacter>(
        `/api/characters?expand=${expand}`,
        id ? 'PATCH' : 'PUT',
        {
          id,
          name: name.trim(),
          age,
          gender,
          race,
          archetype,
          background,
          height,
          weight,
          portraits: portraitIds,
          bio: bio.trim(),
          tags
        }
      );

      onSubmit(responseCharacter);
      open = false;
    } catch (error) {
      report('character editor', error);
      toastError(error);
    } finally {
      isLoading = false;
    }
  };

  const handleDelete = async () => {
    try {
      await request<ICharacter>(`/api/characters/${character.id}`, 'DELETE');
      onDelete(character.id);
      open = false;
    } catch (error) {
      report('character editor', error);
      toastError(error);
    }
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
              <IconButton onClick={randomizeName}>🎲</IconButton>
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.age')}:</div>
            <div>
              <NumberInput value={character.age} onChange={handleValueChange('age')} />
              <span class="extent">{range?.age}</span>
              <IconButton onClick={randomizeAge}>🎲</IconButton>
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.height')}:</div>
            <div>
              <NumberInput value={character.height} onChange={handleValueChange('height')} />
              <span class="extent">{range?.height}</span>
              <IconButton onClick={randomizeHeight}>🎲</IconButton>
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.weight')}:</div>
            <div>
              <NumberInput value={character.weight} onChange={handleValueChange('weight')} />
              <span class="extent">{range?.weight}</span>
              <IconButton onClick={randomizeWeight}>🎲</IconButton>
            </div>
          </div>
        </div>
      </div>

      <TagsEditor bind:tags={character.tags} tagsMap={tags} {openEditorDialog} />

      {#key character.id}
        <BiographyEditor {character} {tags} onChange={handleValueChange('bio')} />
      {/key}
    </div>

    <div class="actions">
      <div>
        {#if character.id}
          <BasicButton disabled={isLoading} variant="text" onClick={handleDelete}>
            {$t('common.controls.delete')}
          </BasicButton>
        {/if}
      </div>

      <div>
        {#if isLoading}
          <CircularSpinner size={20} />
        {/if}

        <BasicButton disabled={isLoading} variant="text" onClick={() => (open = false)}>
          {$t('common.controls.cancel')}
        </BasicButton>

        <BasicButton type="submit" variant="text">
          {$t('common.controls.apply')}
        </BasicButton>
      </div>
    </div>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  form.body {
    padding: 0 1.5rem;

    div.content {
      display: flex;
      flex-direction: column;
      gap: 12px;

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

    div.actions {
      padding: 12px 0;
      display: flex;
      justify-content: space-between;
      gap: 8px;

      div {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
