<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import { language } from '$lib/stores';

  export let data: import('./$types').LayoutData;

  onMount(() => {
    const keys = ['Enter', 'Space', 'ArrowRight', 'ArrowDown'];

    const goToNext = (event: KeyboardEvent) => {
      if (keys.includes(event.code)) {
        event.preventDefault();
        goto(`./${data.next.id}`);
      }
    };

    document.addEventListener('keydown', goToNext);

    return () => {
      document.removeEventListener('keydown', goToNext);
    };
  });

  $: links = [{ id: 'next', key: 'common.controls.next', to: `./${data.next.id}`, prefetch: true }];
</script>

<div class="root" lang={$language}>
  {#key data.next.id}
    <Header {links} />
  {/key}

  <main>
    <slot />
  </main>

  <Footer />
</div>

<style lang="scss">
  div.root {
    height: 100vh;
    overflow: hidden;

    background-image: url('/images/background.webp');
    background-size: cover;
    background-position: center;

    @media (max-width: 599px) {
      background-image: none;
      background-color: $secondary;
    }

    display: flex;
    flex-direction: column;
  }

  main {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
