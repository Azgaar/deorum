<script lang="ts">
  import { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';

  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { t } from '$lib/locales/translations';
  import { signup } from '$lib/api/auth';
  import { language, toastError } from '$lib/stores';

  import type { PBError } from '$lib/error.types';

  export let onClose: null | (() => void) = null;

  let email = '';
  let password = '';

  let isLoading = false;

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    try {
      isLoading = true;
      const lang = $language;
      await signup({ email, password, lang });

      if (!onClose) window.location.href = '/';
      else onClose();
    } catch (error) {
      console.error(error);
      toastError((error as PBError).message);
    } finally {
      isLoading = false;
    }
  };
</script>

<form on:submit={handleSubmit}>
  <Title>{$t('common.auth.signup')}</Title>

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
      {$t('common.auth.signup')}
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