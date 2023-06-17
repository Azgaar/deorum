<script lang="ts">
  import { t } from '$lib/locales/translations';
  import type { IPortraitFilters } from '$lib/types/filters.types';
  export let filters: IPortraitFilters;

  const options = [
    { value: null, label: $t('common.values.all') },
    { value: true, label: $t('common.controls.yes') },
    { value: false, label: $t('common.controls.no') }
  ];
</script>

<div
  aria-label="Filter by assigned character presence"
  class="filter"
  class:inactive={filters.hasCharacters === null}
>
  <span>{$t('admin.editor.hasCharacters')}:</span>
  <div class="buttons">
    {#each options as option}
      <button
        type="button"
        aria-current={filters.hasCharacters === option.value}
        on:click={() => (filters.hasCharacters = option.value)}
      >
        {option.label}
      </button>
    {/each}
  </div>
</div>

<style lang="scss">
  div.filter {
    margin-left: 32px;
    display: grid;
    align-items: baseline;
    grid-template-columns: auto 1fr 20px;
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
