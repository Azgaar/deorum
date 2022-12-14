<script lang="ts">
  import Tooltip, { Wrapper } from '@smui/tooltip';

  import type { ISorting } from '$lib/types/filters.types';
  import { t } from '$lib/locales/translations';

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

<Wrapper>
  <div on:click={handleSort} style="transform: rotate({ANGLES[order]}deg)">{ICON}</div>
  <Tooltip>{$t(`admin.sorting.${order}`)}</Tooltip>
</Wrapper>

<style lang="scss">
  div {
    height: 20px;
    transition: transform 0.2s ease-in-out;
    transform-origin: center;
    cursor: pointer;
  }
</style>
