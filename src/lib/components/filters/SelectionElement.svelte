<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';
  import type { TSelectElement } from '$lib/types/filters.types';

  export let element: TSelectElement;
  export let translationPath: string;
  export let onDelete: VoidFunction;
</script>

<div class="element">
  {#if element.image}
    <img alt={element.id} src={element.image} />
  {:else if element.name}
    <span>{$t(`${translationPath}.${element.name}`)}</span>
  {:else}
    <span>{$t('common.values.undefined')}</span>
  {/if}

  <button on:click={onDelete} use:tooltip title={$t(`${translationPath}.${element.name}`)}>
    ✕
  </button>
</div>

<style lang="scss">
  .element {
    position: relative;

    img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }

    span {
      font-size: 0.8em;
      max-width: 120px;
      padding: 4px 8px;
      border-radius: 1em;
      background-color: rgb($on-surface, 0.9);

      display: flex;
      white-space: nowrap;
    }

    button {
      position: absolute;
      top: 0;
      left: 0;

      border: none;
      background: rgb($on-surface, 0.8);
      border-radius: 50%;
      padding: 0;
      width: 20px;
      height: 20px;
      color: $text;
      cursor: pointer;

      transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
      opacity: 0;
      visibility: hidden;
    }

    &:hover {
      button {
        opacity: 1;
        visibility: visible;
      }
    }
  }
</style>
