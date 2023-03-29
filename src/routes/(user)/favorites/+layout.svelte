<script lang="ts">
  import { fade } from 'svelte/transition';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
</script>

<div class="root">
  <Header />

  <main transition:fade>
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
    align-items: center;
    overflow-y: auto;
  }
</style>
