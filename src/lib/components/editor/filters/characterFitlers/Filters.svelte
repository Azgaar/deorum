<script lang="ts">
  import Dialog, { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Tooltip, { Wrapper } from '@smui/tooltip';

  import { t } from '$lib/locales/translations';
  import { ORIGINALS_IMAGE_PATH } from '$lib/config';
  import Sorting from '../Sorting.svelte';

  import type { ICharacterFilters, ISorting } from '$lib/types/filters.types';

  export let open: boolean;
  export let filters: ICharacterFilters;
  export let sorting: ISorting;
  export let onSubmit: (filters: ICharacterFilters, sorting: ISorting) => void;
  export let racesMap: Map<string, { image: string; name: string }>;

  const handleApply = (event: SubmitEvent) => {
    event.preventDefault();
    onSubmit(filters, sorting);
  };
</script>

<Dialog class="filters" bind:open aria-labelledby="filters" aria-describedby="filters">
  <Title>{$t('admin.menu.filter')}</Title>

  <form class="body" on:submit={handleApply}>
    <div class="content">
      <div class="item" class:inactive={!filters.races.length}>
        <Sorting key="races" bind:sorting />
        <span>{$t('admin.editor.original')}:</span>
        {#if filters.races.length}
          <div class="selected">
            {#each filters.races as raceId (raceId)}
              <Wrapper>
                <img
                  alt={raceId}
                  src={`${ORIGINALS_IMAGE_PATH}/${raceId}/${
                    racesMap.get(raceId)?.image
                  }?thumb=100x100`}
                />
                <Tooltip>{$t(`admin.originals.${racesMap.get(raceId)?.name}`)}</Tooltip>
              </Wrapper>
            {/each}
          </div>
        {/if}
        <span class="edit" on:click={() => {}}>⚙️</span>
      </div>

      <Actions>
        <Button type="button" style="color: white" on:click={() => (open = false)}>
          <Label>{$t('common.controls.cancel')}</Label>
        </Button>
        <Button type="submit" style="color: white">
          <Label>{$t('common.controls.apply')}</Label>
        </Button>
      </Actions>
    </div>
  </form>
</Dialog>

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
