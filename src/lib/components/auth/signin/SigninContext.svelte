<script lang="ts">
  import { setContext } from 'svelte';
  import SigninDialog from './SigninDialog.svelte';

  let open = false;
  let deferredAction = () => {};

  setContext('auth', {
    request: (action: VoidFunction) => {
      open = true;
      deferredAction = action;
    },
    cancel: () => {
      open = false;
    }
  });
</script>

<slot />
<SigninDialog bind:open {deferredAction} />
