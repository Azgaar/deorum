<script lang="ts">
  import { t } from '$lib/locales/translations';

  export let data: {
    statistics: {
      image?: string;
      name?: string;
      count: number;
    }[];
  };

  export let type: 'colors' | 'styles' | 'tags' | 'quality';
</script>

<div class="container">
  {#each data.statistics as stats (stats.name)}
    <div class="item">
      {#if stats.name}<div class="name">{$t(`admin.${type}.${stats.name}`)}</div>{/if}
      <img src={stats.image} alt={stats.name} />
      <div>{stats.count}</div>
    </div>
  {/each}
</div>

<style lang="scss">
  @use 'sass:color';

  div.container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    overflow: hidden;

    div.item {
      aspect-ratio: 1;
      display: flex;
      gap: 4px 0;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid color.adjust(black, $alpha: -0.8);
      padding: 2px;

      div.name {
        text-transform: capitalize;
        max-width: 95%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      img {
        width: 40%;
        aspect-ratio: 1;
      }
    }
  }
</style>
