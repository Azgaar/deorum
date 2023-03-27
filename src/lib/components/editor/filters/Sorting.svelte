<script lang="ts">
  import type { ISorting } from '$lib/types/filters.types';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';

  export let key: string;
  export let sorting: ISorting;

  const ICON = '⇧';
  const ANGLES = { asc: 0, desc: 180, no: 90 };

  $: order = sorting.key === key ? sorting.order : 'no';

  const handleSort = () => {
    const newOrder = order === 'no' ? 'desc' : order === 'asc' ? 'no' : 'asc';
    order = newOrder;
    sorting = { key, order };
  };
</script>

<button
  type="button"
  on:click={handleSort}
  use:tooltip
  title={$t(`admin.sorting.${order}`)}
  style="transform: rotate({ANGLES[order]}deg)"
>
  {ICON}
</button>

<style lang="scss">
  button {
    border: none;
    background: none;
    color: $text;
    height: 20px;
    transition: transform 0.2s ease-in-out;
    transform-origin: center;
    cursor: pointer;
  }
</style>
