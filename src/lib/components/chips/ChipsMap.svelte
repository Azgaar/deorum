<script lang="ts">
  export let chips: string[];
  export let map: Map<string, unknown>;

  const getText = (value: unknown) => {
    if (typeof value === 'string') return value;

    if (typeof value === 'object') {
      const { name, emoji } = value as { emoji: string; name: string };
      return `${emoji} ${name}`;
    }
  };
</script>

<div class="chips">
  {#each chips as chip}
    <div>
      {@html getText(map.get(chip))}
    </div>
  {/each}
</div>

<style>
  .chips {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-evenly;
    justify-items: center;
  }

  .chips > div {
    padding: 0.2em 0.6em;
    margin: 0.2em;
    background: #666;
    border-radius: 16px;
    width: min-content;
  }
</style>
