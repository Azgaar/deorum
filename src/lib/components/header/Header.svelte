<script lang="ts">
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import Navbar from './navbar/Navbar.svelte';
</script>

<header>
  <TextLogo size={42} />
  <Navbar />
</header>

<style lang="scss">
  @use 'sass:color';

  header {
    height: 48px;
    background-color: color.adjust(black, $alpha: -0.8);

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;

    @media ($mobile) {
      padding: 0 8px;
      font-size: small;
    }
  }
</style>
