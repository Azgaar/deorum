<script lang="ts">
  import { fly, fade } from 'svelte/transition';

  import { snackbar } from '$lib/stores';

  let message: typeof $snackbar['message'];
  let status: typeof $snackbar['status'];

  const clearMessage = () => {
    snackbar.set({ message: null, status: 'success' });
    message = null;
  };

  $: {
    if ($snackbar.message) {
      message = $snackbar.message;
      status = $snackbar.status;
      setTimeout(clearMessage, 3000);
    }
  }
</script>

{#if message}
  <div
    class={status}
    in:fly={{ y: 200, duration: 500 }}
    out:fade={{ duration: 300 }}
    on:click={clearMessage}
  >
    {message}
  </div>
{/if}

<style lang="scss">
  div {
    position: absolute;
    bottom: 0%;
    left: 50%;
    line-height: 1.4em;
    padding: 0.8em;
    transform: translate(-50%, -50%);
    z-index: 99;
    max-width: 80%;
    width: max-content;
    user-select: none;
    background-color: #00000095;
  }

  .error {
    color: #e90000;
  }

  .warn {
    color: #dd7200;
  }

  .info {
    color: #fff;
  }

  .success {
    color: #0fc63a;
  }
</style>
