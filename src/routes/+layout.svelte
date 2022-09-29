<script lang="ts" context="module">
  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
</script>

<head>
  <title>Deorum Admin</title>
</head>

<main class="layout">
  <slot />
  <Snackbar />
</main>
