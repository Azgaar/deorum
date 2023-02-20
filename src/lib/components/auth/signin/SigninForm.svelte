<script lang="ts">
  import Textfield from '@smui/textfield';

  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import PasswordInput from '$lib/components/auth/password/PasswordInput.svelte';
  import { t } from '$lib/locales/translations';
  import { signin } from '$lib/api/auth';
  import { toastError } from '$lib/stores';
  import { log, report } from '$lib/utils/log';

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

<form on:submit={handleSubmit}>
  <div class="title">{$t('common.auth.signinTitle')}</div>

  <div class="body">
    <Textfield
      required
      type="email"
      bind:value={email}
      disabled={isLoading}
      label={$t('common.auth.email')}
      input$autocomplete="email"
    />

    <PasswordInput bind:password {isLoading} />
  </div>

  <div class="actions">
    {#if onClose}
      <button type="button" on:click={onClose} disabled={isLoading}>
        {$t('common.controls.cancel')}
      </button>
    {/if}

    <button type="submit" disabled={isLoading}>
      {$t('common.auth.signin')}
      {#if isLoading}
        <CircularSpinner absolute />
      {/if}
    </button>
  </div>
</form>

<style lang="scss">
  @use 'sass:color';

  div.title {
    font-size: 1.2rem;
    font-weight: 300;
    padding: 1rem 2rem;
  }

  div.body {
    width: min(300px, 90vw);
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  div.actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 4px;
    padding: 0.5rem;

    button {
      font-size: 0.8rem;
      letter-spacing: 0.09em;
      text-transform: uppercase;

      padding: 8px 16px;
      border-radius: 24px;
      color: $text;
      transition: background 0.2s ease-in-out;
      background: none;
      border: none;
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: color.adjust($text, $alpha: -0.85);
      }

      &:active {
        background: color.adjust($text, $alpha: -0.95);
      }
    }
  }
</style>
