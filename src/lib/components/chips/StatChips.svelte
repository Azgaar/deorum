<script lang="ts">
  export let chips: IChip[];

  interface IChip {
    count: number;
    emoji?: string | undefined;
    name?: string | undefined;
  }

  const getText = ({ count, emoji, name }: IChip) => {
    return emoji ? `${emoji} ${count}` : `${name}: ${count}`;
  };
</script>

<div class="chips">
  {#each chips as chip}
    <div>{@html getText(chip)}</div>
  {/each}
</div>

<style lang="scss">
  @use 'sass:color';

  div.chips {
    padding: 2px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 2px 4px;
  }

  .chips > div {
    border: 1px solid color.adjust($surface, $lightness: 10%);
    border-radius: 16px;
    padding: 0 4px;
  }
</style>
