<script lang="ts">
  import SigninDialog from '$lib/components/auth/SigninDialog.svelte';
  import { user, role } from '$lib/stores';
</script>

<h2>Role: {$role}</h2>
<h3>User: {$user}</h3>

<SigninDialog open />
