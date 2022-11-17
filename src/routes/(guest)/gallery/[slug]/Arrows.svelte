<script lang="ts">
  export let showNext: (right: boolean) => () => void;
</script>

<div class="arrows">
  <button aria-label="previous" on:click={showNext(false)}>
    <svg viewBox="0 0 5 20">
      <path d="M5 0 L0 10 L5 20 Z" />
    </svg>
  </button>

  <button aria-label="next" on:click={showNext(true)}>
    <svg viewBox="0 0 5 20">
      <path d="M0 0 L5 10 L0 20 Z" />
    </svg>
  </button>
</div>

<style lang="scss">
  @use 'sass:color';

  div.arrows {
    button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      border: 0;
      background: none;
      cursor: pointer;
      color: $primary;
      transition: all 0.2s ease-in-out;
    }

    button:first-child {
      left: 0;
    }

    button:last-child {
      right: 0;
    }

    button:hover {
      color: color.scale($primary, $lightness: 5%);
    }

    svg {
      width: 50px;
      aspect-ratio: 1/2;
      fill: currentColor;
    }
  }
</style>
