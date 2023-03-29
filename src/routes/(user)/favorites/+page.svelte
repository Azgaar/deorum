<script lang="ts">
  import Card from '$lib/components/characters/Card.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="favoritesContainer">
  {#each data.favorite as item (item.id)}
    <Card {item} actionable />
  {/each}
</div>

<style lang="scss">
  div.favoritesContainer {
    padding: 16px 32px;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    grid-gap: 8px;

    font-size: 0.8rem;
  }
</style>
