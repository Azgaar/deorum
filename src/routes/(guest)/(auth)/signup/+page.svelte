<script lang="ts">
  import { goto } from '$app/navigation';

  import SignupForm from '$lib/components/auth/signup/SignupForm.svelte';

  const onClose = () => {
    goto('/', { invalidateAll: true });
  };
</script>

<SignupForm onSuccess={onClose} />
