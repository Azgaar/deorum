<script lang="ts">
  import { setContext } from 'svelte';
  import SigninDialog from './SigninDialog.svelte';
  import { page } from '$app/stores';

  let open = false;
  let deferredAction: VoidFunction;

  setContext('auth', {
    require: (action: VoidFunction) => {
      if ($page.data.userId) {
        // already signed in
        action();
        return;
      }

      open = true;
      deferredAction = action;
    },
    cancel: () => {
      open = false;
    }
  });
</script>

<slot />
<SigninDialog bind:isOpen={open} {deferredAction} />
