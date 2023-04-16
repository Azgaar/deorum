<script lang="ts">
  import { goto } from '$app/navigation';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import Card from '$lib/components/characters/Card.svelte';
  import { t } from '$lib/locales/translations';
  import type { PageData } from './$types';

  export let data: PageData;
  $: custom = data.myCharacters.custom;
  $: liked = data.myCharacters.liked;
</script>

<div class="wrapper">
  <section>
    <header>
      <h2>{$t('common.myCharacters.custom.title')} ({custom.length})</h2>
      <BasicButton onClick={() => goto('/create')}>
        {$t('common.myCharacters.custom.create')}
      </BasicButton>
    </header>

    {#if custom.length === 0}
      <p>{$t('common.myCharacters.custom.empty')}</p>
    {:else}
      <div class="grid">
        {#each custom as item (item.id)}
          <Card {item} actionable />
        {/each}
      </div>
    {/if}
  </section>

  <section>
    <header>
      <h2>{$t('common.myCharacters.liked.title')} ({liked.length})</h2>
      <a href="/gallery" data-sveltekit-preload-data={'hover'}>
        {$t('common.myCharacters.liked.goToGallery')}
      </a>
    </header>

    {#if liked.length === 0}
      <p>
        {$t('common.myCharacters.liked.empty')}
      </p>
    {:else}
      <div class="grid">
        {#each liked as item (item.id)}
          <Card {item} actionable />
        {/each}
      </div>
    {/if}
  </section>
</div>

<style lang="scss">
  div.wrapper {
    padding: 16px 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      h2 {
        font-size: 1.2rem;
        font-weight: 400;
        text-shadow: 0px 0px 6px black;
        margin: 0;
      }

      a {
        color: $text;
        text-transform: uppercase;
        font-size: 0.8rem;
        text-shadow: 0px 0px 1rem black;
      }
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      grid-gap: 8px;

      font-size: 0.8rem;
    }
  }
</style>
