<script lang="ts">
  import type { TUnits } from '$lib/types/components.types';

  export let units: TUnits;
</script>

<div>
  <button class="button" type="button" on:click={() => (units = 'metric')}>kg</button>
  <button class="button" type="button" on:click={() => (units = 'imperial')}>lbs</button>
</div>

<style lang="scss">
  @use 'sass:color';
  div {
    display: flex;
    align-items: center;

    button {
      font-size: 12px;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      color: $text;
      cursor: pointer;
    }
  }
</style>
