<script lang="ts">
  import Snackbar, { Label, Actions, type SnackbarComponentDev } from '@smui/snackbar';
  import IconButton from '@smui/icon-button';

  import { snackbar } from '$lib/stores';
  import './_styles.scss';

  let component: SnackbarComponentDev;
  let message: string;
  let status: 'success' | 'error' | 'warning';

  $: {
    if ($snackbar.message) {
      message = $snackbar.message;
      status = $snackbar.status;
      component.open();
      $snackbar.message = null;
    }
  }
</script>

<Snackbar bind:this={component} class="error">
  <Label>{message}</Label>
  <Actions>
    <IconButton class="material-icons close" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>
