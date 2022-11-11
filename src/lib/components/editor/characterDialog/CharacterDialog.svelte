<script lang="ts">
  import Dialog, { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  import { t } from '$lib/locales/translations';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import NumberInput from '$lib/components/inputs/NumberInput.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import { request } from '$lib/utils/loading';

  import EditButton from '../EditButton.svelte';
  import Portraits from './portraits/Portraits.svelte';

  import type { ICharacter } from '$lib/types/api.types';

  export let open: boolean;
  export let character: ICharacter;
  export let onSubmit: (character: ICharacter) => void;
  export let portraitIds: string[];

  export let races: Map<string, { name: string }>;
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

  const randomizeAge = () => {
    const age = Math.floor(Math.random() * 100);
    character.age = age;
  };

  const randomizeName = async () => {
    const url = `/api/names/ironarachne?quantity=1&race=${character.race}&type=${character.gender}`;
    character.name = await request(url);
  };

  const handleValueChange = (attribute: keyof ICharacter) => (value: number | string) => {
    (character[attribute] as string | number) = value;
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    onSubmit(character);
    open = false;
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
    {$t(character.id ? 'common.controls.edit' : 'common.controls.add')}
    {$t('admin.editor.character')}</Title
  >

  <form class="body" on:submit={handleSubmit}>
    <div class="content">
      <Portraits bind:ids={portraitIds} />

      <div class="element">
        <div>{$t('common.character.name')}:</div>
        <div class="grid column2">
          <TextInput value={character.name} onChange={handleValueChange('name')} />
          <EditButton onClick={randomizeName} icon="🎲" label="common.controls.random" />
        </div>
      </div>

      <div class="element">
        <div>{$t('common.character.age')}:</div>
        <div class="grid column2">
          <div class="grid column2">
            <NumberInput value={character.age} onChange={handleValueChange('age')} />
            <span style="font-size: small; white-space: nowrap;">0 – 100</span>
          </div>
          <EditButton onClick={randomizeAge} icon="🎲" label="common.controls.random" />
        </div>
      </div>

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
        <Select value={character.race} options={raceOptions} onChange={handleValueChange('race')} />
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

  div.content {
    padding: 1rem 1rem;
    max-width: 400px;

    display: flex;
    flex-direction: column;
    gap: 4px;

    div.element {
      display: grid;
      grid-template-columns: 1fr 3fr;
      gap: 4px;
      align-items: center;

      div.grid {
        display: grid;
        gap: 1rem;
        align-items: center;
      }

      div.column2 {
        grid-template-columns: 2fr 1fr;
      }
    }
  }
</style>
