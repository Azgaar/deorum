<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import GenericDialog from '$lib/components/editor/genericDialog/GenericDialog.svelte';
  import Sorting from '$lib/components/filters/Sorting.svelte';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';
  import type { IPortraitFilters, ISorting } from '$lib/types/filters.types';
  import ColorsFilter from './ColorsFilter.svelte';
  import HasCharactersFilter from './HasCharactersFilter.svelte';
  import OriginalsFilter from './OriginalsFilter.svelte';
  import QualityFilter from './QualityFilter.svelte';

  export let isOpen: boolean;
  export let filters: IPortraitFilters;
  export let sorting: ISorting;
  export let defaultSorting: ISorting;
  export let onSubmit: (filters: IPortraitFilters, sorting: ISorting) => void;

  export let originalsMap: Map<string, { image: string; name: string }>;
  export let tagsMap: Map<string, { image: string; name: string }>;
  export let stylesMap: Map<string, { image: string; name: string }>;

  let showOriginalsDialog = false;
  let showColorsDialog = false;

  let genericDialogData = {
    isOpen: false,
    key: '',
    entries: [] as [string, { image: string; name: string }][],
    selected: [] as string[],
    onSubmit: (_: string[]) => {}
  };

  const handleListEdit =
    (
      key: 'styles' | 'tags',
      map: Map<string, { image: string; name: string }>,
      selected: string[]
    ) =>
    () => {
      const entries = Array.from(map.entries());

      const onSubmit = (newSelected: string[]) => {
        filters[key] = newSelected;
      };

      genericDialogData = { isOpen: true, key, entries, selected, onSubmit };
    };

  const handleCancel = () => {
    isOpen = false;
  };

  const handleApply = (event: SubmitEvent) => {
    event.preventDefault();
    onSubmit(filters, sorting);
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader>
    {$t('admin.menu.filter')}
  </DialogHeader>

  <form on:submit={handleApply}>
    <DialogBody>
      <div class="content">
        <div class="item" class:inactive={!filters.quality.length}>
          <Sorting key="quality" bind:sorting {defaultSorting} />
          <span>{$t('admin.editor.quality')}:</span>
          <QualityFilter bind:quality={filters.quality} />
        </div>

        <div class="item" class:inactive={!filters.original.length}>
          <Sorting key="original" bind:sorting {defaultSorting} />
          <span>{$t('admin.editor.original')}:</span>
          {#if filters.original.length}
            <div class="selected rounded">
              {#each filters.original as originalId (originalId)}
                <img
                  alt={originalId}
                  src={originalsMap.get(originalId)?.image}
                  use:tooltip
                  title={$t(`admin.originals.${originalsMap.get(originalId)?.name}`)}
                />
              {/each}
            </div>
          {/if}
          <button type="button" class="edit" on:click={() => (showOriginalsDialog = true)}
            >⚙️</button
          >
        </div>

        <div class="item" class:inactive={!filters.colors.length}>
          <Sorting key="colors" bind:sorting {defaultSorting} />
          <span>{$t('admin.editor.colors')}:</span>
          {#if filters.colors.length}
            <div class="selected rounded">
              {#each filters.colors as color (color)}
                <div
                  style="background-color: {color}"
                  use:tooltip
                  title={$t(`admin.colors.${color}`)}
                />
              {/each}
            </div>
          {/if}
          <button type="button" class="edit" on:click={() => (showColorsDialog = true)}>⚙️</button>
        </div>

        <div class="item" class:inactive={!filters.tags.length}>
          <Sorting key="tags" bind:sorting {defaultSorting} />
          <span>{$t('admin.editor.tags')}:</span>
          {#if filters.tags.length}
            <div class="selected">
              {#each filters.tags as tagId (tagId)}
                <img
                  src={tagsMap.get(tagId)?.image}
                  alt={$t(`admin.tags.${tagsMap.get(tagId)?.name}`)}
                  use:tooltip
                  title={$t(`admin.tags.${tagsMap.get(tagId)?.name}`)}
                />
              {/each}
            </div>
          {/if}
          <button
            type="button"
            class="edit"
            on:click={handleListEdit('tags', tagsMap, filters.tags)}>⚙️</button
          >
        </div>

        <div class="item" class:inactive={!filters.styles.length}>
          <Sorting key="styles" bind:sorting {defaultSorting} />
          <span>{$t('admin.editor.styles')}:</span>
          {#if filters.styles.length}
            <div class="selected">
              {#each filters.styles as styleId (styleId)}
                <img
                  src={stylesMap.get(styleId)?.image}
                  alt={$t(`admin.styles.${stylesMap.get(styleId)?.name}`)}
                  use:tooltip
                  title={$t(`admin.styles.${stylesMap.get(styleId)?.name}`)}
                />
              {/each}
            </div>
          {/if}
          <button
            type="button"
            class="edit"
            on:click={handleListEdit('styles', stylesMap, filters.styles)}>⚙️</button
          >
        </div>

        <div class="item" class:inactive={filters.hasCharacters === null}>
          <span>{$t('admin.editor.hasCharacters')}:</span>
          <HasCharactersFilter bind:hasCharacters={filters.hasCharacters} />
        </div>
      </div>
    </DialogBody>

    <DialogFooter>
      <DialogAction handleClick={handleCancel}>
        {$t('common.controls.cancel')}
      </DialogAction>

      <DialogAction type="submit">
        {$t('common.controls.apply')}
      </DialogAction>
    </DialogFooter>
  </form>
</Dialog>

<OriginalsFilter
  bind:isOpen={showOriginalsDialog}
  selected={filters.original}
  entries={Array.from(originalsMap.entries())}
  onSubmit={(newSelected) => {
    filters.original = newSelected;
  }}
/>

<ColorsFilter
  bind:isOpen={showColorsDialog}
  selected={filters.colors}
  onSubmit={(newSelected) => {
    filters.colors = newSelected;
  }}
/>
<GenericDialog {...genericDialogData} />

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    div.content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .item {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;

        span,
        button {
          transition: all 0.2s ease-in-out;
        }

        &.inactive > span {
          color: #aaa;
        }

        span:first-child {
          flex: 1;
        }

        .selected {
          display: flex;
          flex-wrap: wrap;
          gap: 0 3px;

          img,
          div {
            width: 20px;
            height: 20px;
          }
        }

        .rounded {
          img,
          div {
            border-radius: 50%;
          }
        }
      }

      .edit {
        background: none;
        border: none;
        cursor: pointer;
      }
    }
  }
</style>
