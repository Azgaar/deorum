<script lang="ts">
  import { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';

  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { t } from '$lib/locales/translations';
  import { signin } from '$lib/api/auth';
  import { toastError } from '$lib/stores';
  import { log, report } from '$lib/utils/log';

  import PasswordInput from '../password/PasswordInput.svelte';

  export let onClose: () => void;

  let email = '';
  let password = '';

  let isLoading = false;

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    try {
      isLoading = true;
      await signin({ email, password });
      log('auth', `Signin successful: ${email}`);
      onClose();
    } catch (error) {
      report('auth', error);
      toastError(error);
    } finally {
      isLoading = false;
    }
  };
</script>

<form on:submit={handleSubmit} disabled={isLoading}>
  <Title>{$t('common.auth.signinTitle')}</Title>

  <div class="body">
    <Textfield
      required
      type="email"
      updateInvalid
      bind:value={email}
      disabled={isLoading}
      label={$t('common.auth.email')}
      input$autocomplete="email"
    />

    <PasswordInput bind:password {isLoading} />
  </div>

  <Actions>
    {#if onClose}
      <Button type="button" style="color: white" on:click={onClose} disabled={isLoading}>
        <Label>{$t('common.controls.cancel')}</Label>
      </Button>
    {/if}

    <button type="submit" disabled={isLoading}>
      {#if isLoading}
        <CircularSpinner />
      {/if}
      {$t('common.auth.signin')}
    </button>
  </Actions>
</form>

<style lang="scss">
  div.body {
    width: min(300px, 90vw);
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  button {
    font-size: 0.875rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: white;
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;

    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
