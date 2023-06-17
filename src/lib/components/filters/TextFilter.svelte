<script lang="ts">
  import Sorting from '$lib/components/filters/Sorting.svelte';
  import { t } from '$lib/locales/translations';
  import type { ICharacterFilters, ISorting } from '$lib/types/filters.types';

  export let entity: 'name' | 'bio';
  export let filters: ICharacterFilters;
  export let sorting: ISorting;
  export let defaultSorting: ISorting;
</script>

<div aria-label={`Filter by ${entity}`} class="filter" class:inactive={!filters[entity].length}>
  <Sorting key={entity} bind:sorting {defaultSorting} />
  <span>{$t(`common.character.${entity}`)}:</span>
  <input type="search" bind:value={filters[entity]} />
</div>

<style lang="scss">
  div.filter {
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr 2fr 20px;
    gap: 0.5em;

    &.inactive > span {
      color: rgb($text, 0.2);
    }

    span {
      transition: all 0.2s ease-in-out;
    }

    input {
      text-indent: 6px;
      color: $text;
      background: rgb($text, 0.01);
      border: none;
      border-bottom: 1px solid rgb($text, 0.02);
      border-radius: 4px;
      outline: none;
    }
  }
</style>
