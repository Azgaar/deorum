<script lang="ts">
  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
</script>

<head>
  <title>Deorum Admin</title>
</head>

<main class="layout">
  <slot />
  <Snackbar />
</main>
