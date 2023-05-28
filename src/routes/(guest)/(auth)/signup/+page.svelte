<script lang="ts">
  import { goto } from '$app/navigation';

  import SignupForm from '$lib/components/auth/signup/SignupForm.svelte';

  const onClose = () => {
    goto('/', { invalidateAll: true });
  };
</script>

<div class="form-wrapper">
  <SignupForm onSuccess={onClose} />
</div>

<style lang="scss">
  .form-wrapper {
    padding: 20px 20px 14px;
  }
</style>
