<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import { language } from '$lib/stores';

  import type { ILink } from '$lib/types/components.types';

  export let data: import('./$types').LayoutData;

  const links: ILink[] = [
    {
      id: 'next',
      key: 'common.controls.next',
      to: `./${data.next.id}`,
      reload: true,
      prefetch: true
    }
  ];
</script>

<div class="root" lang={$language}>
  <Header {links} />

  <main>
    <slot />
  </main>

  <Footer />
</div>

<style lang="scss">
  div.root {
    height: 100vh;
    overflow: hidden;

    background-image: url('/images/background.png');
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
