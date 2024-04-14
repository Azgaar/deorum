<script lang="ts">
  import View from '$lib/components/mediaQuery/View.svelte';

  export let next: VoidFunction;
  export let prev: VoidFunction;
</script>

<View>
  <div slot="desktop" class="arrows noprint">
    <button aria-label="previous" on:click={prev}>
      <svg viewBox="0 0 5 20">
        <path d="M5 0 L0 10 L5 20 Z" />
      </svg>
    </button>

    <button aria-label="next" on:click={next}>
      <svg viewBox="0 0 5 20">
        <path d="M0 0 L5 10 L0 20 Z" />
      </svg>
    </button>
  </div>
</View>

<style lang="scss">
  @use 'sass:color';

  div.arrows {
    button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      border: 0;
      outline: none;
      background: none;

      transition: color 0.2s ease-in-out;
      color: $primary;
      cursor: pointer;

      &:hover {
        color: color.scale($primary, $lightness: 5%);
      }

      &:first-child {
        left: 0;
      }

      &:last-child {
        right: 0;
      }

      svg {
        width: 50px;
        aspect-ratio: 1/2;

        fill: currentColor;
        stroke-linecap: square;
      }
    }
  }
</style>
