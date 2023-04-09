<script lang="ts">
  import Card from '$lib/components/characters/Card.svelte';
  import { t } from '$lib/locales/translations';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="wrapper">
  <section>
    <h2>{$t('common.myCharacters.custom')}</h2>
    <div class="grid">
      {#each data.myCharacters.custom as item (item.id)}
        <Card {item} actionable />
      {/each}
    </div>
  </section>

  <section>
    <h2>{$t('common.myCharacters.liked')}</h2>
    <div class="grid">
      {#each data.myCharacters.liked as item (item.id)}
        <Card {item} actionable />
      {/each}
    </div>
  </section>
</div>

<style lang="scss">
  div.wrapper {
    padding: 16px 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    h2 {
      text-shadow: 0px 0px 1rem black;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      grid-gap: 8px;

      font-size: 0.8rem;
    }
  }
</style>
