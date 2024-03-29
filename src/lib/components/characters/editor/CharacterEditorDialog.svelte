<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import { createOptions } from '$lib/components/characters/editor/options';
  import { createRandomizer } from '$lib/components/characters/editor/randomize';
  import { getRange } from '$lib/components/characters/editor/range';
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import IconButton from '$lib/components/editor/IconButton.svelte';
  import NumberInput from '$lib/components/inputs/NumberInput.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import { KEYS } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';
  import { hideLoadingOverlay, showLoadingOverlay, toastError, toastSuccess } from '$lib/stores';
  import type {
    IArchetype,
    IBackground,
    ICharacter,
    IRace,
    ITag,
    TGender
  } from '$lib/types/api.types';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import { convertToImperialHeight, convertToImperialWeight } from '$lib/utils/units';
  import BiographyEditor from './BiographyEditor.svelte';
  import PortraitEditor from './PortraitEditor.svelte';

  export let isOpen: boolean;
  export let character: ICharacter;

  export let races: Map<string, IRace>;
  export let archetypes: Map<string, IArchetype>;
  export let backgrounds: Map<string, IBackground>;
  export let tags: Map<string, ITag>;

  $: range = getRange(character.gender, character.race, races);
  $: randomize = createRandomizer(character, (updated: ICharacter) => (character = updated), races);

  const options = createOptions(races, archetypes, backgrounds);
  let isPortraitPoolLoaded: boolean;

  const handleGenderChange = (value: string) => {
    character.gender = value as TGender;
    isPortraitPoolLoaded = false;
  };

  const handleRaceChange = (value: string) => {
    character.race = value;
    const race = races.get(value);
    if (race) character['@expand'].race = race;
    isPortraitPoolLoaded = false;
  };

  const handleArchetypeChange = (value: string) => {
    character.archetype = value;
    const archetype = archetypes.get(value);
    if (archetype) character['@expand'].archetype = archetype;
    isPortraitPoolLoaded = false;
  };

  const handleBackgroundChange = (value: string) => {
    character.background = value;
    const background = backgrounds.get(value);
    if (background) character['@expand'].background = background;
    isPortraitPoolLoaded = false;
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const isUpdating = Boolean(character.creator);

    try {
      showLoadingOverlay();

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

      if (isUpdating) {
        await request<ICharacter>(`/api/custom/${character.id}`, 'PATCH', patchData);
        await invalidate(KEYS.CUSTOM_CHARACTER);
      } else {
        const createData = { ...patchData, creator: $page.data.userId, source: character.id };
        await request<ICharacter>('/api/custom', 'POST', createData);
        await invalidate(KEYS.USER_DATA);
      }

      await invalidate(KEYS.LIBRARY);
      isOpen = false;
    } catch (error) {
      report('edit character', error, character);
      toastError(error);
    } finally {
      hideLoadingOverlay();
      toastSuccess(
        $t(
          isUpdating ? 'common.details.editor.success.edit' : 'common.details.editor.success.create'
        )
      );
    }
  };
</script>

<Dialog {isOpen}>
  <DialogHeader>
    {$t(character.id ? 'common.details.editor.edit' : 'common.details.editor.create')}
  </DialogHeader>

  <form on:submit={handleSubmit}>
    <DialogBody>
      <div class="columns">
        <div class="column">
          <PortraitEditor bind:character bind:isPortraitPoolLoaded />
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
              <div>
                <NumberInput bind:value={character.age} />
                <span class="padLeft small" use:tooltip title={$t('common.metrics.range')}>
                  {range?.age}
                </span>
              </div>

              <IconButton onClick={randomize.age} title={$t('common.details.editor.randomize.age')}>
                🎲
              </IconButton>
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.height')}:</div>
            <div>
              <div
                use:tooltip
                title={$t('common.character.height') + ': ' + $t(`common.metrics.cm`)}
              >
                <NumberInput bind:value={character.height} />
                <span
                  class="small"
                  use:tooltip
                  title={$t('common.character.height') + ': ' + $t(`common.metrics.feetAndInches`)}
                >
                  {convertToImperialHeight(character.height)}
                </span>
              </div>

              <span class="padLeft small" use:tooltip title={$t('common.metrics.range')}>
                {range?.height}
              </span>
              <IconButton
                onClick={randomize.height}
                title={$t('common.details.editor.randomize.height')}>🎲</IconButton
              >
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.weight')}:</div>
            <div>
              <div
                use:tooltip
                title={$t('common.character.weight') + ': ' + $t('common.metrics.kg')}
              >
                <NumberInput bind:value={character.weight} />
                <span
                  class="small"
                  use:tooltip
                  title={$t('common.character.weight') + ': ' + $t('common.metrics.lbs')}
                >
                  {convertToImperialWeight(character.weight)}
                  {$t('common.metrics.lbs')}
                </span>
              </div>

              <span class="padLeft small" use:tooltip title={$t('common.metrics.range')}>
                {range?.weight}
              </span>
              <IconButton
                onClick={randomize.weight}
                title={$t('common.details.editor.randomize.weight')}>🎲</IconButton
              >
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.gender')}:</div>
            <Select
              value={character.gender}
              options={options.gender}
              onChange={handleGenderChange}
            />
          </div>

          <div class="element">
            <div>{$t('common.character.race')}:</div>
            <Select value={character.race} options={options.race} onChange={handleRaceChange} />
          </div>

          <div class="element">
            <div>{$t('common.character.archetype')}:</div>
            <Select
              value={character.archetype}
              options={options.archetype}
              onChange={handleArchetypeChange}
            />
          </div>

          <div class="element">
            <div>{$t('common.character.background')}:</div>
            <Select
              value={character.background}
              options={options.background}
              onChange={handleBackgroundChange}
            />
          </div>
        </div>
      </div>

      {#key character.id}
        <BiographyEditor bind:character {tags} />
      {/key}
    </DialogBody>

    <DialogFooter>
      <DialogAction handleClick={() => (isOpen = false)}>
        {$t('common.controls.cancel')}
      </DialogAction>

      <DialogAction type="submit">
        {$t('common.controls.save')}
      </DialogAction>
    </DialogFooter>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  form {
    font-size: 14px;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    div.columns {
      display: grid;
      gap: 16px;

      @media ($desktop) {
        grid-template-columns: 4fr 5fr;
      }

      div.column {
        display: flex;
        flex-direction: column;
        gap: 6px;

        div.element {
          display: grid;
          grid-template-columns: 1fr 3fr;
          align-items: center;
          gap: 4px;

          div {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          span.padLeft {
            padding-left: 4px;
          }

          span.small {
            font-size: small;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
