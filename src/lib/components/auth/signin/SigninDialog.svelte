<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import SigninForm from './SigninForm.svelte';

  export let isOpen: boolean;
  export let deferredAction: VoidFunction = () => {};

  const handleCancel = () => {
    isOpen = false;
  };

  const handleSuccess = async () => {
    isOpen = false;
    await invalidateAll();
    deferredAction();
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <SigninForm onSuccess={handleSuccess} />
</Dialog>
