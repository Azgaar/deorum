<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
</script>

<div class="root">
  <Header />
  <slot />
  <Footer />
</div>

<style lang="scss">
  div.root {
    height: 100vh;
    overflow: hidden;

    background-image: url('/images/background.webp');
    background-size: cover;
    background-position: center;

    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-areas: 'header' 'main' 'footer';
  }
</style>
