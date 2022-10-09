<script lang="ts">
  import Dialog from '@smui/dialog';

  import SigninForm from './SigninForm.svelte';

  export let open: boolean;
  const onClose = () => (open = false);
</script>

<Dialog bind:open aria-labelledby="signin-dialog" aria-describedby="signin-dialog">
  <SigninForm {onClose} />
</Dialog>
