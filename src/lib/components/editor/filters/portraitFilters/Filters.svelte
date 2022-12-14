<script lang="ts">
  import Dialog, { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Tooltip, { Wrapper } from '@smui/tooltip';

  import EditorDialog from '$lib/components/editorDialog/EditorDialog.svelte';
  import { t } from '$lib/locales/translations';
  import { ORIGINALS_IMAGE_PATH } from '$lib/config';
  import QualityFilter from './QualityFilter.svelte';
  import OriginalsFilter from './OriginalsFilter.svelte';
  import ColorsFilter from './ColorsFilter.svelte';
  import Sorting from '../Sorting.svelte';

  import type { IPortraitFilters, ISorting } from '$lib/types/filters.types';

  export let open: boolean;
  export let filters: IPortraitFilters;
  export let sorting: ISorting;
  export let onSubmit: (filters: IPortraitFilters, sorting: ISorting) => void;

  export let originalsMap: Map<string, { image: string; name: string }>;
  export let tagsMap: Map<string, { image: string; name: string }>;
  export let stylesMap: Map<string, { image: string; name: string }>;

  let showOriginalsDialog = false;
  let showColorsDialog = false;

  let editorDialogData = {
    open: false,
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

      editorDialogData = { open: true, key, entries, selected, onSubmit };
    };

  const handleApply = (event: SubmitEvent) => {
    event.preventDefault();
    onSubmit(filters, sorting);
  };
</script>

<Dialog class="filters" bind:open aria-labelledby="filters" aria-describedby="filters">
  <Title>{$t('admin.menu.filter')}</Title>

  <form class="body" on:submit={handleApply}>
    <div class="content">
      <div class="item" class:inactive={!filters.quality.length}>
        <Sorting key="quality" bind:sorting />
        <span>{$t('admin.editor.quality')}:</span>
        <QualityFilter bind:quality={filters.quality} />
      </div>

      <div class="item" class:inactive={!filters.original.length}>
        <Sorting key="original" bind:sorting />
        <span>{$t('admin.editor.original')}:</span>
        {#if filters.original.length}
          <div class="selected">
            {#each filters.original as originalId (originalId)}
              <Wrapper>
                <img
                  alt={originalId}
                  src={`${ORIGINALS_IMAGE_PATH}/${originalId}/${
                    originalsMap.get(originalId)?.image
                  }?thumb=100x100`}
                />
                <Tooltip>{$t(`admin.originals.${originalsMap.get(originalId)?.name}`)}</Tooltip>
              </Wrapper>
            {/each}
          </div>
        {/if}
        <span class="edit" on:click={() => (showOriginalsDialog = true)}>⚙️</span>
      </div>

      <div class="item" class:inactive={!filters.colors.length}>
        <Sorting key="colors" bind:sorting />
        <span>{$t('admin.editor.colors')}:</span>
        {#if filters.colors.length}
          <div class="selected">
            {#each filters.colors as color (color)}
              <Wrapper>
                <div style="background-color: {color};" />
                <Tooltip>{$t(`admin.colors.${color}`)}</Tooltip>
              </Wrapper>
            {/each}
          </div>
        {/if}
        <span class="edit" on:click={() => (showColorsDialog = true)}>⚙️</span>
      </div>

      <div class="item" class:inactive={!filters.tags.length}>
        <Sorting key="tags" bind:sorting />
        <span>{$t('admin.editor.tags')}:</span>
        {#if filters.tags.length}
          <div class="selected">
            {#each filters.tags as tagId (tagId)}
              <Wrapper>
                <div>{tagsMap.get(tagId)?.image}</div>
                <Tooltip>{$t(`admin.tags.${tagsMap.get(tagId)?.name}`)}</Tooltip>
              </Wrapper>
            {/each}
          </div>
        {/if}
        <span class="edit" on:click={handleListEdit('tags', tagsMap, filters.tags)}>⚙️</span>
      </div>

      <div class="item" class:inactive={!filters.styles.length}>
        <Sorting key="styles" bind:sorting />
        <span>{$t('admin.editor.styles')}:</span>
        {#if filters.styles.length}
          <div class="selected">
            {#each filters.styles as styleId (styleId)}
              <Wrapper>
                <div>{stylesMap.get(styleId)?.image}</div>
                <Tooltip>{$t(`admin.styles.${stylesMap.get(styleId)?.name}`)}</Tooltip>
              </Wrapper>
            {/each}
          </div>
        {/if}
        <span class="edit" on:click={handleListEdit('styles', stylesMap, filters.styles)}>⚙️</span>
      </div>
    </div>

    <Actions>
      <Button type="button" style="color: white" on:click={() => (open = false)}>
        <Label>{$t('common.controls.cancel')}</Label>
      </Button>
      <Button type="submit" style="color: white">
        <Label>{$t('common.controls.apply')}</Label>
      </Button>
    </Actions>
  </form>
</Dialog>

<OriginalsFilter
  bind:open={showOriginalsDialog}
  bind:original={filters.original}
  entries={Array.from(originalsMap.entries())}
/>

<ColorsFilter bind:open={showColorsDialog} bind:colors={filters.colors} />

<EditorDialog {...editorDialogData} />

<style lang="scss">
  div.content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0 2rem;

    .item {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;

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
          border-radius: 50%;
        }
      }
    }

    .item.inactive > span {
      color: #aaa;
    }

    .edit {
      cursor: pointer;
    }
  }
</style>
