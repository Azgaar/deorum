<script lang="ts">
  import { clickOutside } from '$lib/events/clickOutside';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import { getLocalCopy } from '$lib/utils/characters';
  import { request } from '$lib/utils/requests';
  import EditorDialog from './EditorDialog.svelte';
  import { exportChar } from './export';

  import type { IArchetype, IBackground, ICharacter, IRace, ITag } from '$lib/types/api.types';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import type { IEditorData } from './editor';

  export let item: IGalleryItem;
  let editor = { open: false } as IEditorData;

  const handleEditClick = async () => {
    try {
      const expand = 'race,archetype,background,portraits';

      const characterLocalCopy = getLocalCopy(item.id);
      const characterPromise = characterLocalCopy
        ? Promise.resolve(characterLocalCopy)
        : request<ICharacter>(`/api/characters/${item.id}?expand=${expand}`);

      const [character, racesArray, archetypesArray, backgroundsArray, tagsArray] =
        await Promise.all([
          characterPromise,
          request<IRace[]>('/api/races'),
          request<IArchetype[]>('/api/archetypes'),
          request<IBackground[]>('/api/backgrounds'),
          request<ITag[]>('/api/tags')
        ]);

      const races = new Map(racesArray.map((race) => [race.id, race]));
      const archetypes = new Map(archetypesArray.map(({ id, name }) => [id, { name }]));
      const backgrounds = new Map(backgroundsArray.map(({ id, name }) => [id, { name }]));
      const tags = new Map(tagsArray.map(({ id, image, name }) => [id, { image, name }]));
      editor = { open: true, character, races, archetypes, backgrounds, tags };
    } catch (error) {
      toastError(error);
    }
  };

  const exportOptions = {
    show: false,
    open: () => (exportOptions.show = true),
    close: () => (exportOptions.show = false)
  };
</script>

<section class="actionsPane">
  <div>
    <button on:click={handleEditClick}>{$t('common.controls.edit')}</button>
  </div>

  <div>
    <button on:click={exportOptions.open}>{$t('common.details.export.export')}</button>

    {#if exportOptions.show}
      <div
        class="options"
        use:clickOutside
        on:clickOutside={exportOptions.close}
        on:click={exportOptions.close}
      >
        <button on:click={exportChar(item, 'portrait')}
          >{$t('common.details.export.portrait')}</button
        >
        <button on:click={exportChar(item, 'cardImage')}
          >{$t('common.details.export.cardImage')}</button
        >
        <button on:click={exportChar(item, 'text')}>{$t('common.details.export.text')}</button>
        <button on:click={exportChar(item, 'json')}>{$t('common.details.export.json')}</button>
      </div>
    {/if}
  </div>
</section>

{#if editor.open}<EditorDialog bind:item {...editor} bind:open={editor.open} />{/if}

<style lang="scss">
  @use 'sass:color';

  section.actionsPane {
    display: flex;
    gap: 8px;

    button {
      border: 0;
      background: #fdd8ae;
      padding: 6px 18px;
      border-radius: 2px;
      transition: all 0.2s ease-in-out;
      cursor: pointer;

      &:hover {
        background: #d4a878;
      }
    }

    div {
      position: relative;

      .options {
        position: absolute;
        bottom: 100%;
        padding: 8px;
        width: max-content;

        display: flex;
        flex-direction: column;
        gap: 8px;

        background-color: color.adjust(black, $alpha: -0.7);
        @media ($mobile) {
          background-color: $surface;
        }
      }
    }
  }
</style>
