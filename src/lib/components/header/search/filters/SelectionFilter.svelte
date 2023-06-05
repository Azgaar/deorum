<script lang="ts">
  import Sorting from '$lib/components/editor/filters/Sorting.svelte';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';
  import { toastError } from '$lib/stores';
  import type { ICharacterFilters, ISorting } from '$lib/types/filters.types';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import SelectionDialog from './SelectionDialog.svelte';
  import SelectionElement from './SelectionElement.svelte';

  export let entity: 'race' | 'archetype' | 'background';
  export let dataPath: string;
  export let translationPath: string;
  export let filters: ICharacterFilters;
  export let sorting: ISorting;

  let isOpen = false;
  let data: { id: string; name: string; image?: string }[] = [];
  $: title = $t(`common.controls.select`) + ' ' + $t(`common.character.${entity}`);

  loadData();
  async function loadData() {
    try {
      data = await request(dataPath);
    } catch (error) {
      report('selection filter', error);
      toastError(error);
    }
  }
</script>

<div aria-label={`Filter by ${entity}`} class="filter" class:inactive={!filters[entity].length}>
  <Sorting key={entity} bind:sorting />
  <span>{$t(`common.character.${entity}`)}:</span>
  <div class="elements">
    {#each filters[entity] as id (id)}
      <SelectionElement element={data.find((item) => item.id === id)} {translationPath} />
    {/each}
  </div>
  <button type="button" class="edit" on:click={() => (isOpen = true)}>⚙️</button>
</div>

{#if isOpen}
  <SelectionDialog
    bind:isOpen
    {title}
    {data}
    {translationPath}
    selected={filters[entity]}
    onSubmit={(selected) => (filters[entity] = selected)}
  />
{/if}

<style lang="scss">
  div.filter {
    position: relative;
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr 2fr auto;
    gap: 0.5em;

    &.inactive > span {
      color: rgba($color: $text, $alpha: 0.2);
    }

    .elements {
      display: flex;
      flex-wrap: wrap;
      gap: 1px 3px;
    }

    .edit {
      background: none;
      border: none;
      cursor: pointer;

      padding: 0;
      width: 20px;
      height: 20px;
    }
  }
</style>
