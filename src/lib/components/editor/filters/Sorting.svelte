<script lang="ts">
  import type { ISorting } from '$lib/types/filters.types';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';

  export let key: string;
  export let sorting: ISorting;
  export let defaultSorting: ISorting;

  const ANGLES = { asc: 0, desc: 180, no: 90 };

  $: order = sorting.key === key ? sorting.order : 'no';
  $: key === 'race' && console.log({ order, sorting, defaultSorting });

  const handleSort = () => {
    const newOrder = order === 'no' ? 'desc' : order === 'asc' ? 'no' : 'asc';
    sorting = newOrder === 'no' ? defaultSorting : { key, order: newOrder };
  };
</script>

<button
  type="button"
  class:active={order !== 'no'}
  on:click={handleSort}
  use:tooltip
  title={$t(`common.search.sorting.${order}`)}
  style="transform: rotate({ANGLES[order]}deg)"
>
  {'⇧'}
</button>

<style lang="scss">
  button {
    height: 20px;
    border: none;
    background: none;

    color: rgba($color: $text, $alpha: 0.2);

    &.active {
      color: $text;
    }

    transition: all 0.2s ease-in-out;
    transform-origin: center;
    cursor: pointer;
  }
</style>
