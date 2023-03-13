<script lang="ts">
  import { page } from '$app/stores';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import SigninContext from '$lib/components/auth/signin/SigninContext.svelte';
</script>

<div class="root" lang={$page.data.lang}>
  <Header />
  <SigninContext>
    <slot />
  </SigninContext>
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
