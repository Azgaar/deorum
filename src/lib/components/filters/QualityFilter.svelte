<script lang="ts">
  import { qualities } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import type { IPortraitFilters, ISorting } from '$lib/types/filters.types';
  import Sorting from './Sorting.svelte';

  export let filters: IPortraitFilters;
  export let sorting: ISorting;
  export let defaultSorting: ISorting;

  const handleChange = (value: string) => () => {
    filters.quality = filters.quality.includes(value)
      ? filters.quality.filter((v) => v !== value)
      : [...filters.quality, value];
  };
</script>

<div aria-label="Filter by quality" class="filter" class:inactive={!filters.quality.length}>
  <Sorting key="quality" bind:sorting {defaultSorting} />

  <span>{$t('admin.editor.quality')}:</span>

  <div class="quality">
    {#each qualities as value}
      <button
        type="button"
        aria-current={filters.quality.includes(String(value))}
        on:click={handleChange(String(value))}
      >
        <span>{value}</span>
      </button>
    {/each}
  </div>
</div>

<style lang="scss">
  .filter {
    height: 20px;

    display: grid;
    align-items: baseline;
    grid-template-columns: auto auto 1fr;
    gap: 0.52em;

    &.inactive > span {
      color: rgb($text, 0.2);
    }

    span {
      transition: all 0.2s ease-in-out;
    }

    .quality {
      display: flex;
      gap: 1px;
      height: 20px;

      button {
        width: 20px;
        border-radius: 16px;
        padding: 0;

        cursor: pointer;
        color: rgb($text, 0.3);
        background-color: rgb($secondary, 0.15);
        border: none;
        transition: all 0.2s ease-in-out;
      }

      button:hover {
        color: rgb($text, 0.8);
        background-color: rgb($secondary, 0.3);
      }

      button[aria-current='true'] {
        color: $text;
        background-color: $secondary;
      }
    }
  }
</style>
