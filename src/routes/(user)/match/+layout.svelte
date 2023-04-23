<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';

  $: nextId = $page.data.next.id;

  onMount(() => {
    const keys = ['Enter', 'Space', 'ArrowRight', 'ArrowDown'];

    const goToNext = (event: KeyboardEvent) => {
      if (keys.includes(event.code)) {
        event.preventDefault();
        goto(`./${nextId}`);
      }
    };

    document.addEventListener('keydown', goToNext);

    return () => {
      document.removeEventListener('keydown', goToNext);
    };
  });
</script>

<div class="root">
  {#key nextId}
    <Header />
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
