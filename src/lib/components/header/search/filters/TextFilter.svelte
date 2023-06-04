<script lang="ts">
  import Sorting from '$lib/components/editor/filters/Sorting.svelte';
  import { t } from '$lib/locales/translations';
  import type { ICharacterFilters, ISorting } from '$lib/types/filters.types';

  export let entity: 'name' | 'bio';
  export let filters: ICharacterFilters;
  export let sorting: ISorting;
</script>

<div aria-label={`Filter by ${entity}`} class="filter" class:inactive={!filters[entity].length}>
  <Sorting key={entity} bind:sorting />
  <span>{$t(`common.character.${entity}`)}:</span>
  <input type="text" bind:value={filters[entity]} />
</div>

<style lang="scss">
  div.filter {
    display: grid;
    align-items: center;
    justify-items: end;
    grid-template-columns: auto auto 1fr;
    gap: 0.5em;

    &.inactive > span {
      color: rgba($color: $text, $alpha: 0.2);
    }

    span {
      transition: all 0.2s ease-in-out;
    }

    input {
      background: none;
      border: none;
      border-bottom: 1px solid rgba($text, 0.4);
      outline: none;
      color: $text;

      height: 22px;
      text-indent: 6px;
    }
  }
</style>
