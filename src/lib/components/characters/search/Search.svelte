<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import Button from '$lib/components/header/Button.svelte';
  import Search from '$lib/components/icons/Search.svelte';
  import View from '$lib/components/mediaQuery/View.svelte';
  import { pages } from '$lib/config/pages';
  import { t } from '$lib/locales/translations';
  import SearchDialog from './SearchDialog.svelte';

  let isOpen = false;
  $: isVisible = $page.route.id && pages.gallery.includes($page.route.id);

  let shake = browser && localStorage.getItem('deorum-shake-search-button') !== 'false';
  const shakeOff = () => {
    shake = false;
    localStorage.setItem('deorum-shake-search-button', 'false');
  };
</script>

<div aria-label="Search container">
  {#if isVisible}
    <Button onClick={() => (isOpen = true)}>
      <View>
        <div slot="desktop" class:shake on:mouseenter|once={shakeOff}>
          {$t('common.search.search')}
        </div>

        <div slot="mobile" class:shake on:pointerdown|once={shakeOff}>
          <Search width={20} />
        </div>
      </View>
    </Button>
  {/if}

  <SearchDialog bind:isOpen />
</div>

<style lang="scss">
  .shake {
    animation-name: shake;
    animation-timing-function: cubic-bezier(0.455, 0.03, 0.515, 0.955);
    animation-duration: 10s;
    animation-delay: 0s, 20s;
    animation-iteration-count: 30;
  }

  @keyframes shake {
    0% {
      transform: rotate(0deg);
      transform-origin: 50% 0;
    }
    1% {
      transform: rotate(1deg);
    }
    2%,
    4%,
    6% {
      transform: rotate(-2deg);
    }
    3%,
    5%,
    7% {
      transform: rotate(2deg);
    }
    8% {
      transform: rotate(-1deg);
    }
    9% {
      transform: rotate(1deg);
    }
    10% {
      transform: rotate(0deg);
    }
  }
</style>
