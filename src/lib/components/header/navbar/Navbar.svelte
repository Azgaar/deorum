<script lang="ts">
  import View from '$lib/components/mediaQuery/View.svelte';
  import NavbarMobile from './NavbarMobile.svelte';
  import NavbarDesktop from './NavbarDesktop.svelte';
</script>

<View>
  <NavbarDesktop slot="desktop" />
  <NavbarMobile slot="mobile" />
</View>
