<script lang="ts">
  import Sorting from '$lib/components/filters/Sorting.svelte';
  import { genders } from '$lib/data/genders';
  import { t } from '$lib/locales/translations';
  import type { ICharacterFilters, ISorting } from '$lib/types/filters.types';
  export let filters: ICharacterFilters;
  export let sorting: ISorting;
  export let defaultSorting: ISorting;
</script>

<div aria-label="Filter by gender" class="filter" class:inactive={!filters.gender.length}>
  <Sorting key="gender" bind:sorting {defaultSorting} />
  <span>{$t('common.character.gender')}:</span>
  <div class="buttons">
    <button
      type="button"
      aria-current={filters.gender === ''}
      on:click={() => (filters.gender = '')}
    >
      {$t(`common.values.any`)}
    </button>

    {#each genders as gender}
      <button
        type="button"
        aria-current={filters.gender === gender}
        on:click={() => (filters.gender = gender)}
      >
        {$t(`common.genders.${gender}`)}
      </button>
    {/each}
  </div>
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

    .buttons {
      padding: 0 8px;
      display: flex;
      gap: 1.2em;

      @media ($mobile) {
        padding: 0 0 0 30px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5em;
      }

      button {
        padding: 0;
        border: 0;
        outline: none;
        background: none;
        white-space: nowrap;
        cursor: pointer;

        transition: color 0.2s ease-in-out;
        color: rgb($text, 0.2);

        &[aria-current='true'] {
          color: rgb($text, 0.7);
        }

        &:hover {
          color: rgb($text, 1);
        }
      }
    }
  }
</style>
