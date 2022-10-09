<script lang="ts">
  import { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';

  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { t } from '$lib/locales/translations';
  import { signin } from '$lib/api/auth';
  import { toastError, role } from '$lib/stores';

  import type { PBError } from '$lib/error.types';
  import { Role } from '$lib/stores/auth';

  export let onClose: null | (() => void) = null;

  let email = '';
  let password = '';

  let isLoading = false;

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    try {
      isLoading = true;
      await signin({ email, password });

      if (!onClose) {
        window.location.href = $role === Role.ADMIN ? '/admin' : '/';
      } else onClose();
    } catch (error) {
      console.error(error);
      toastError((error as PBError).message);
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

    <Textfield
      required
      type="password"
      updateInvalid
      bind:value={password}
      disabled={isLoading}
      label={$t('common.auth.password')}
      input$autocomplete="password"
      input$pattern={'.{8,}'}
    />
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
    font-family: Roboto, sans-serif;
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