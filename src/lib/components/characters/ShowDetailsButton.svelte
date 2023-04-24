<script lang="ts">
  import { browser } from '$app/environment';
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import ArrowRight from '$lib/components/icons/ArrowRight.svelte';
  import { t } from '$lib/locales/translations';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  export let href: string;

  let showText = false;
  const storageKey = 'deorum-showDetails-used-times';

  onMount(() => {
    if (browser) {
      const clickedBefore = Number(localStorage.getItem(storageKey));
      showText = clickedBefore < 5;
    }
  });

  const handleTextClick = () => {
    const usedBefore = Number(localStorage.getItem(storageKey));
    localStorage.setItem(storageKey, String(usedBefore + 1));
  };
</script>

{#if showText}
  <div on:click={handleTextClick} on:keydown={handleTextClick}>
    <ActionButton {href}>
      <span in:fly={{ x: 20, duration: 500 }}>
        {$t('common.gallery.showDetails')}
      </span>
      <ArrowRight width={32} />
    </ActionButton>
  </div>
{:else}
  <ActionButton {href} title={$t('common.gallery.showDetails')}>
    <ArrowRight width={32} />
  </ActionButton>
{/if}

<style lang="scss">
  span {
    font-size: 0.8rem;
    padding-left: 10px;
  }
</style>
