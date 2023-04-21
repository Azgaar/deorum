<script lang="ts">
  import { goto, invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import { createOptions } from '$lib/components/characters/editor/options';
  import { createRandomizer } from '$lib/components/characters/editor/randomize';
  import { getRange } from '$lib/components/characters/editor/range';
  import IconButton from '$lib/components/editor/IconButton.svelte';
  import NumberInput from '$lib/components/inputs/NumberInput.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import { KEYS } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { hideLoadingOverlay, showLoadingOverlay, toastError } from '$lib/stores';
  import type { ICharacter, IRace } from '$lib/types/api.types';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import Dialog, { Title } from '@smui/dialog';
  import BiographyEditor from './BiographyEditor.svelte';
  import PortraitEditor from './PortraitEditor.svelte';

  export let open: boolean;
  export let character: ICharacter;

  export let races: Map<string, IRace>;
  export let archetypes: Map<string, { name: string }>;
  export let backgrounds: Map<string, { name: string }>;
  export let tags: Map<string, { name: string; image: string }>;

  $: mode = character.id ? 'edit' : 'create';
  $: range = getRange(character.gender, character.race, races);
  $: randomize = createRandomizer(character, (updated: ICharacter) => (character = updated), races);

  const options = createOptions(races, archetypes, backgrounds);

  const handleSubmit = async (event: SubmitEvent) => {
    try {
      event.preventDefault();
      showLoadingOverlay();

      const isCustom = Boolean(character.creator);
      const patchData = {
        name: character.name.trim(),
        age: character.age,
        gender: character.gender,
        race: character.race,
        archetype: character.archetype,
        background: character.background,
        portraits: character.portraits,
        weight: character.weight,
        height: character.height,
        bio: character.bio.trim(),
        tags: character.tags
      };

      if (isCustom) {
        // update custom character
        await request<ICharacter>(`/api/custom/${character.id}`, 'PATCH', patchData);
        invalidate(KEYS.CUSTOM_CHARACTER);
      } else {
        // create custom character
        const createData = {
          ...patchData,
          creator: $page.data.userId,
          source: character.id
        };
        await request<ICharacter>('/api/custom', 'POST', createData);
        invalidate(KEYS.MY_CHARACTERS);
      }

      open = false;
    } catch (error) {
      report('edit character', error, character);
      toastError(error);
    } finally {
      hideLoadingOverlay();
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
    {$t(mode === 'create' ? 'common.details.editor.create' : 'common.details.editor.edit')}
  </Title>

  <form class="body" on:submit={handleSubmit}>
    <div class="content">
      <div class="columns">
        <div class="column">
          <PortraitEditor bind:character />
        </div>

        <div class="column">
          <div class="element">
            <div>{$t('common.character.name')}:</div>
            <div>
              <TextInput bind:value={character.name} />
              <IconButton
                onClick={randomize.name}
                title={$t('common.details.editor.randomize.name')}>🎲</IconButton
              >
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.age')}:</div>
            <div>
              <NumberInput bind:value={character.age} />
              <span class="extent">{range?.age}</span>
              <IconButton onClick={randomize.age} title={$t('common.details.editor.randomize.age')}
                >🎲</IconButton
              >
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.height')}:</div>
            <div>
              <NumberInput bind:value={character.height} />
              <span class="extent">{range?.height}</span>
              <IconButton
                onClick={randomize.height}
                title={$t('common.details.editor.randomize.height')}>🎲</IconButton
              >
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.weight')}:</div>
            <div>
              <NumberInput bind:value={character.weight} />
              <span class="extent">{range?.weight}</span>
              <IconButton
                onClick={randomize.weight}
                title={$t('common.details.editor.randomize.weight')}>🎲</IconButton
              >
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.gender')}:</div>
            <Select bind:value={character.gender} options={options.gender} />
          </div>

          <div class="element">
            <div>{$t('common.character.race')}:</div>
            <Select bind:value={character.race} options={options.race} />
          </div>

          <div class="element">
            <div>{$t('common.character.archetype')}:</div>
            <Select bind:value={character.archetype} options={options.archetype} />
          </div>

          <div class="element">
            <div>{$t('common.character.background')}:</div>
            <Select bind:value={character.background} options={options.background} />
          </div>
        </div>
      </div>

      {#key character.id}
        <BiographyEditor bind:character {tags} />
      {/key}
    </div>

    <div class="actions">
      <BasicButton variant="text" onClick={() => (open = false)}>
        {$t('common.controls.cancel')}
      </BasicButton>

      <BasicButton type="submit" variant="text">
        {$t('common.controls.save')}
      </BasicButton>
    </div>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  form.body {
    padding: 0 1.5rem;
    font-size: 14px;

    div.content {
      display: flex;
      flex-direction: column;
      gap: 12px;

      div.columns {
        display: grid;
        grid-template-columns: 4fr 5fr;
        gap: 16px;

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
      justify-content: flex-end;
      gap: 8px;
    }
  }
</style>
