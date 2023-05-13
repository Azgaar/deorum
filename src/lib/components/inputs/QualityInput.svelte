<script lang="ts">
  import { qualities } from '$lib/config';

  export let quality: number;
  export let onChange: (value: number) => void;

  const handleChange = (value: number) => () => {
    onChange(value);
  };
</script>

<div class="quality">
  {#each qualities as value}
    <button class:active={value <= quality} on:click={handleChange(value)}>
      <span class:current={value === quality}>{value}</span>
    </button>
  {/each}
</div>

<style lang="scss">
  .quality {
    display: flex;
    justify-content: space-evenly;
    height: 23px;

    button {
      width: 100%;
      cursor: pointer;
      color: $text;
      background-color: rgba($secondary, 0.6);
      border: none;
      transition: all 0.2s ease-in-out;

      display: flex;
      justify-content: center;
      align-items: center;
      font-size: small;

      span {
        pointer-events: none;
        white-space: nowrap;
      }

      span:not(.current) {
        opacity: 0;
      }
    }

    .active {
      background-color: rgba($secondary, 0.7);
    }

    button:hover {
      background-color: rgba($secondary, 0.75);

      span:not(.current) {
        opacity: 0.5;
      }
    }

    button:first-child {
      border-radius: 16px 0 0 16px;
    }

    button:last-child {
      border-radius: 0 16px 16px 0;
    }
  }
</style>
