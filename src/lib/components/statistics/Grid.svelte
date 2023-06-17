<script lang="ts">
  import { t } from '$lib/locales/translations';

  export let data: {
    statistics: {
      image?: string;
      name?: string;
      count: number;
    }[];
  };

  export let type:
    | 'colors'
    | 'styles'
    | 'tags'
    | 'quality'
    | 'races'
    | 'genders'
    | 'archetypes'
    | 'backgrounds';
  export let module: 'admin' | 'common' = 'admin';
</script>

<div class="container">
  {#each data.statistics as stats (stats.name)}
    <div class="item">
      {#if stats.name}<div class="name">{$t(`${module}.${type}.${stats.name}`)}</div>{/if}
      {#if stats.image}<img src={stats.image} alt={stats.name} />{/if}
      <div>{stats.count}</div>
    </div>
  {/each}
</div>

<style lang="scss">
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
      border: 1px solid rgb(black, 0.2);
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
