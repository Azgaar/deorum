<script lang="ts">
  import Dialog, { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Tooltip, { Wrapper } from '@smui/tooltip';

  import { t } from '$lib/locales/translations';
  import type { IFilters } from '$lib/filters.types';
  import QualityFilter from './QualityFilter.svelte';
  import OriginalsFilter from './OriginalsFilter.svelte';
  import ColorsFilter from './ColorsFilter.svelte';
  import EditorDialog from '../editorDialog/EditorDialog.svelte';

  export let open: boolean;
  export let filters: IFilters;
  export let sort: string;
  export let onSubmit: (filters: IFilters, sort: string) => void;

  export let originalsImagePath: string;
  export let originalsMap: Map<string, { image: string; name: string }>;
  export let tagsMap: Map<string, { emoji: string; name: string }>;
  export let stylesMap: Map<string, { emoji: string; name: string }>;

  let showOriginalsDialog = false;
  let showColorsDialog = false;

  let editorDialogData = {
    open: false,
    key: '',
    entries: [] as [string, { emoji: string; name: string }][],
    selected: [] as string[],
    onSubmit: (_: string[]) => {}
  };

  const handleListEdit =
    (
      key: 'styles' | 'tags',
      map: Map<string, { emoji: string; name: string }>,
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

    const formData = new FormData(event.target as HTMLFormElement);
    const newSort = formData.get('sort') as string;

    onSubmit(filters, newSort);
  };
</script>

<Dialog class="filters" bind:open aria-labelledby="filters" aria-describedby="filters">
  <Title>{$t('admin.menu.filter')}</Title>

  <form class="body" on:submit={handleApply}>
    <div class="content">
      <div class="item" class:inactive={!filters.quality.length}>
        <span>{$t('admin.editor.quality')}:</span>
        <QualityFilter bind:quality={filters.quality} />
      </div>

      <div class="item" class:inactive={!filters.original.length}>
        <span>{$t('admin.editor.original')}:</span>
        {#if filters.original.length}
          <div class="selected">
            {#each filters.original as originalId (originalId)}
              <Wrapper>
                <img
                  alt={originalId}
                  src={`${originalsImagePath}/${originalId}/${
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
        <span>{$t('admin.editor.tags')}:</span>
        {#if filters.tags.length}
          <div class="selected">
            {#each filters.tags as tagId (tagId)}
              <Wrapper>
                <div>{tagsMap.get(tagId)?.emoji}</div>
                <Tooltip>{$t(`admin.tags.${tagsMap.get(tagId)?.name}`)}</Tooltip>
              </Wrapper>
            {/each}
          </div>
        {/if}
        <span class="edit" on:click={handleListEdit('tags', tagsMap, filters.tags)}>⚙️</span>
      </div>

      <div class="item" class:inactive={!filters.styles.length}>
        <span>{$t('admin.editor.styles')}:</span>
        {#if filters.styles.length}
          <div class="selected">
            {#each filters.styles as styleId (styleId)}
              <Wrapper>
                <div>{stylesMap.get(styleId)?.emoji}</div>
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
  path={originalsImagePath}
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

    .item.inactive {
      color: #aaa;
    }

    .edit {
      cursor: pointer;
    }
  }
</style>
