<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { logout } from '$lib/api/auth';

  onMount(() => {
    logout();
    goto('/signin', { invalidateAll: true });
  });
</script>
