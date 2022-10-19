<script lang="ts">
  export let chips: IChip[];
  export let translate: ((key: string) => string) | null = null;

  interface IChip {
    count: number;
    image?: string | undefined;
    name?: string | undefined;
  }
</script>

<div class="chips">
  {#each chips as chip}
    <div title={translate && chip.name ? translate(chip.name) : null}>
      <img src={chip.image} alt={chip.name} />
      {chip.count}
    </div>
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
    display: flex;
    align-items: center;
    gap: 2px;

    img {
      width: 14px;
      height: min-content;
    }
  }
</style>
