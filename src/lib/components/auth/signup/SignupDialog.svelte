<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import SignupForm from './SignupForm.svelte';

  export let isOpen: boolean;
  const handleClose = () => (isOpen = false);
</script>

<Dialog {isOpen} onClickOutside={handleClose}>
  <SignupForm onSuccess={handleClose} />
</Dialog>
