<script lang="ts">
  export let quality: number[];

  const values = Array(11)
    .fill(0)
    .map((_, i) => i);

  const handleChange = (value: number) => () => {
    quality = quality.includes(value) ? quality.filter((v) => v !== value) : [...quality, value];
  };
</script>

<div class="quality">
  {#each values as value}
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
      color: $text;
      background-color: rgba($secondary, 0.15);
      border: none;
      transition: all 0.2s ease-in-out;
    }

    button:hover {
      background-color: rgba($secondary, 0.3);
    }

    button.current {
      background-color: $secondary;
    }
  }
</style>
