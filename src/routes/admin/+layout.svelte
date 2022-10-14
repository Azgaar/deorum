<script lang="ts" context="module">
  import { language } from '$lib/stores';
</script>

<svelte:head>
  <title>Deorum Admin</title>
</svelte:head>

<div class="root" lang={$language} translate="no">
  <slot />
</div>
