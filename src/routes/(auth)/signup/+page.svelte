<script lang="ts">
  import SignupDialog from '$lib/components/auth/SignupDialog.svelte';
  import { user, role } from '$lib/stores';
</script>

<h2>Role: {$role}</h2>
<h3>User: {$user}</h3>

<SignupDialog open />
