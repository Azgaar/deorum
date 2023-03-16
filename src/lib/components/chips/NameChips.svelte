<script lang="ts">
  import Label from '../label/Label.svelte';

  export let chips: IChip[] = [];
  export let type: string;

  interface IChip {
    image: string;
    name: string;
  }
</script>

<div class="chips">
  {#each chips as chip}
    <div>
      <Label label={chip} {type} />
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
  }
</style>
