<script lang="ts">
  import { qualities } from '$lib/config';

  export let quality: number[];

  const handleChange = (value: number) => () => {
    quality = quality.includes(value) ? quality.filter((v) => v !== value) : [...quality, value];
  };
</script>

<div class="quality">
  {#each qualities as value}
    <button type="button" class:current={quality.includes(value)} on:click={handleChange(value)}>
      <span>{value}</span>
    </button>
  {/each}
</div>

<style lang="scss">
  .quality {
    display: flex;
    gap: 2px;
    height: 22px;

    button {
      width: 22px;
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

    button.current {
      color: $text;
      background-color: $secondary;
    }
  }
</style>
