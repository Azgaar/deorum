<script lang="ts">
  import Checkbox from '$lib/components/inputs/Checkbox.svelte';

  export let src: string;
  export let id: string;
  export let isSelected: boolean;
  export let isDisabled = false;
</script>

<figure data-id={id} class:isDisabled>
  <img loading="lazy" draggable="false" alt={id} {src} class:selected={isSelected} />

  <div class="checkbox" class:hidden={!isSelected}>
    <Checkbox checked={isSelected} />
  </div>
</figure>

<style lang="scss">
  figure {
    position: relative;
    margin: 0;
    aspect-ratio: 1;

    &.isDisabled {
      pointer-events: none;
    }

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      transition: filter 0.2s ease-in-out;

      &.selected {
        filter: brightness(0.7);
      }
    }

    div.checkbox {
      position: absolute;
      bottom: 2px;
      left: 2px;
      transition: all 0.3s ease-in-out;

      &.hidden {
        opacity: 0;
      }

      --checkbox-border-color: #ffffffe6;
    }

    &:hover {
      div.checkbox {
        opacity: 1;
      }
    }
  }
</style>
