<script lang="ts">
  import Dialog from '@smui/dialog';
  import SignupForm from './SignupForm.svelte';

  export let open: boolean;
  const onClose = () => (open = false);
</script>

<Dialog bind:open aria-labelledby="signup-dialog" aria-describedby="signup-dialog">
  <SignupForm onSuccess={onClose} />
</Dialog>
