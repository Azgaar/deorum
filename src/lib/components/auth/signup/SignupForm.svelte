<script lang="ts">
  import { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';

  import { t } from '$lib/locales/translations';
  import { signup } from '$lib/api/auth';

  export let onClose: null | (() => void) = null;

  let email = '';
  let password = '';

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    await signup({ email, password });

    if (!onClose) window.location.href = '/';
    else onClose();
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
      label={$t('common.auth.email')}
      input$autocomplete="email"
    />

    <Textfield
      required
      type="password"
      updateInvalid
      bind:value={password}
      label={$t('common.auth.password')}
      input$autocomplete="password"
      input$pattern={'.{8,}'}
    />
  </div>

  <Actions>
    {#if onClose}
      <Button type="button" style="color: white" on:click={onClose}>
        <Label>{$t('common.controls.cancel')}</Label>
      </Button>
    {/if}

    <button type="submit">{$t('common.auth.signup')}</button>
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
  }
</style>
