<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import IconButton from '$lib/components/editor/IconButton.svelte';
  import NumberInput from '$lib/components/inputs/NumberInput.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { charactersConfig } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { ICharacter, IRace } from '$lib/types/api.types';
  import type { TOpenEditorDialog } from '$lib/types/editor.types';
  import { report } from '$lib/utils/log';
  import { makePOJO } from '$lib/utils/object';
  import { createRandomizer } from '$lib/utils/randomize';
  import { request } from '$lib/utils/requests';
  import BiographyEditor from '../BiographyEditor.svelte';
  import { createOptions } from '../options';
  import { getRange } from '../range';
  import Portraits from './portraits/Portraits.svelte';
  import TagsEditor from './tags/TagsEditor.svelte';

  export let isOpen: boolean;
  export let character: ICharacter;
  export let onSubmit: (character: ICharacter) => void;
  export let onDelete: (characterId: string) => void;
  export let portraitIds: string[];

  export let races: Map<string, IRace>;
  export let archetypes: Map<string, { name: string }>;
  export let backgrounds: Map<string, { name: string }>;
  export let tags: Map<string, { name: string; image: string }>;

  export let openEditorDialog: TOpenEditorDialog;

  let current = makePOJO(character);
  let isLoading = false;

  $: range = getRange(current.gender, current.race, races);
  $: randomize = createRandomizer(
    current,
    (updated: ICharacter) => (current = updated),
    races,
    archetypes,
    backgrounds
  );

  const options = createOptions(races, archetypes, backgrounds);

  let isNameRandomizing: boolean = false;

  const handleNameRandomize = async () => {
    isNameRandomizing = true;
    await randomize.name();
    isNameRandomizing = false;
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    try {
      isLoading = true;
      const { id, name, age, gender, race, archetype, background, height, weight, bio, tags } =
        current;
      const responseCharacter = await request<ICharacter>(
        `/api/characters?expand=${charactersConfig.expand}`,
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
      isOpen = false;
    } catch (error) {
      report('character editor', error);
      toastError(error);
    } finally {
      isLoading = false;
    }
  };

  const handleCancel = () => {
    isOpen = false;
  };

  const handleDelete = async () => {
    try {
      await request<ICharacter>(`/api/characters/${current.id}`, 'DELETE');
      onDelete(current.id);
      isOpen = false;
    } catch (error) {
      report('character editor', error);
      toastError(error);
    }
  };
</script>

<Dialog {isOpen}>
  <DialogHeader>
    {$t(current.id ? 'common.controls.edit' : 'common.controls.create')}
    {$t('admin.editor.character')}
  </DialogHeader>

  <form on:submit={handleSubmit}>
    <DialogBody>
      <div class="content">
        <Portraits bind:ids={portraitIds} />

        <div class="columns">
          <div class="column">
            <div class="element">
              <div>{$t('common.character.gender')}:</div>
              <Select bind:value={current.gender} options={options.gender} />
            </div>

            <div class="element">
              <div>{$t('common.character.race')}:</div>
              <Select bind:value={current.race} options={options.race} />
            </div>

            <div class="element">
              <div>{$t('common.character.archetype')}:</div>
              <Select bind:value={current.archetype} options={options.archetype} />
            </div>

            <div class="element">
              <div>{$t('common.character.background')}:</div>
              <Select bind:value={current.background} options={options.background} />
            </div>
          </div>

          <div class="column">
            <div class="element">
              <div>{$t('common.character.name')}:</div>
              <div>
                <TextInput bind:value={current.name} />

                {#if isNameRandomizing}
                  <IconButton disabled>
                    <CircularSpinner size={16} />
                  </IconButton>
                {:else}
                  <IconButton
                    onClick={handleNameRandomize}
                    title={$t('common.details.editor.randomize.name')}>🎲</IconButton
                  >
                {/if}
              </div>
            </div>

            <div class="element">
              <div>{$t('common.character.age')}:</div>
              <div>
                <NumberInput bind:value={current.age} />
                <span class="extent">{range?.age}</span>
                <IconButton onClick={randomize.age}>🎲</IconButton>
              </div>
            </div>

            <div class="element">
              <div>{$t('common.character.height')}:</div>
              <div>
                <NumberInput bind:value={current.height} />
                <span class="extent">{range?.height}</span>
                <IconButton onClick={randomize.height}>🎲</IconButton>
              </div>
            </div>

            <div class="element">
              <div>{$t('common.character.weight')}:</div>
              <div>
                <NumberInput bind:value={current.weight} />
                <span class="extent">{range?.weight}</span>
                <IconButton onClick={randomize.weight}>🎲</IconButton>
              </div>
            </div>
          </div>
        </div>

        <TagsEditor bind:tags={current.tags} tagsMap={tags} {openEditorDialog} />

        {#key current.id}
          <BiographyEditor bind:character={current} {tags} />
        {/key}
      </div>
    </DialogBody>

    <DialogFooter>
      <div class="actionPane">
        <div>
          {#if current.id}
            <DialogAction disabled={isLoading} handleClick={handleDelete}>
              {$t('common.controls.delete')}
            </DialogAction>
          {/if}
        </div>

        <div>
          {#if isLoading}
            <CircularSpinner size={20} />
          {/if}

          <DialogAction disabled={isLoading} handleClick={handleCancel}>
            {$t('common.controls.cancel')}
          </DialogAction>

          <DialogAction type="submit">
            {$t('common.controls.apply')}
          </DialogAction>
        </div>
      </div>
    </DialogFooter>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

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

    div.actionPane {
      width: 100%;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;

      div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1rem;
      }
    }
  }
</style>
