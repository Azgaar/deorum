<script lang="ts">
  import Dialog, { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  import { t } from '$lib/locales/translations';
  import type { IFilters } from '$lib/filters.types';
  import { parseFilters } from '$lib/utils/filters';
  import QualityFilter from './QualityFilter.svelte';
  import OriginalsFilter from './OriginalsFilter.svelte';

  export let open: boolean;
  export let filters: IFilters;
  export let sort: string;
  export let onSubmit: (filters: IFilters, sort: string) => void;

  export let originalsImagePath: string;
  export let originals: Map<string, { image: string; name: string }>;

  let { original, quality, colors, tags, styles } = filters;

  let showOriginalsDialog = false;

  const handleApply = (event: SubmitEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const newSort = formData.get('sort') as string;
    const newFilters = { original, quality, colors, tags, styles };

    onSubmit(newFilters, newSort);
  };
</script>

<Dialog class="filters" bind:open aria-labelledby="filters" aria-describedby="filters">
  <Title>{$t('admin.menu.filter')}</Title>

  <form class="body" on:submit={handleApply}>
    <div class="content">
      <div class="item" class:inactive={!quality.length}>
        <span>{$t('admin.editor.quality')}:</span>
        <QualityFilter bind:quality />
      </div>

      <div class="item" class:inactive={!original.length}>
        <span>{$t('admin.editor.original')}:</span>
        {#if original.length}
          <div class="originalsGallery">
            {#each original as originalId (originalId)}
              <img
                alt={originalId}
                src={`${originalsImagePath}/${originalId}/${
                  originals.get(originalId)?.image
                }?thumb=100x100`}
              />
            {/each}
          </div>
        {/if}
        <span class="edit" on:click={() => (showOriginalsDialog = true)}>⚙️</span>
      </div>

      <div class="item" class:inactive={!colors.length}>
        <span>{$t('admin.editor.colors')}:</span>
        <span class="edit">⚙️</span>
      </div>

      <div class="item" class:inactive={!tags.length}>
        <span>{$t('admin.editor.tags')}:</span>
        <span class="edit">⚙️</span>
      </div>

      <div class="item" class:inactive={!styles.length}>
        <span>{$t('admin.editor.styles')}:</span>
        <span class="edit">⚙️</span>
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
  bind:original
  path={originalsImagePath}
  entries={Array.from(originals.entries())}
/>

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

      .originalsGallery {
        display: flex;
        flex-wrap: wrap;
        gap: 0 2px;

        img {
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
