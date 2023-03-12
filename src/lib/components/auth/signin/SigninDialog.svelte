<script lang="ts">
  import Dialog from '@smui/dialog';
  import { invalidateAll } from '$app/navigation';
  import SigninForm from './SigninForm.svelte';

  export let open: boolean;
  export let deferredAction: VoidFunction = () => {};

  const onCancel = () => {
    open = false;
  };

  const onSuccess = async () => {
    open = false;
    await invalidateAll();
    deferredAction();
  };
</script>

<Dialog bind:open aria-labelledby="signin-dialog" aria-describedby="signin-dialog">
  <SigninForm {onCancel} {onSuccess} />
</Dialog>
