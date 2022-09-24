<script lang="ts">
  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
  import type { SnackbarComponentDev } from '@smui/snackbar';

  let snackbar: SnackbarComponentDev;
</script>

<head>
  <title>Deorum Admin</title>
</head>

<main>
  <slot />
  <Snackbar {snackbar} />
</main>
