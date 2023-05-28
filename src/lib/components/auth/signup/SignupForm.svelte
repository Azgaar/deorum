<script lang="ts">
  import { page } from '$app/stores';
  import { signup } from '$lib/api/auth';
  import Input from '$lib/components/auth/elements/Input.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import { log, report } from '$lib/utils/log';

  export let onCancel: VoidFunction | null = null;
  export let onSuccess = () => {};

  let name = '';
  let email = '';
  let password = '';

  let isLoading = false;

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    try {
      isLoading = true;
      const lang = $page.data.lang;
      await signup({ email, password, name, lang });
      onSuccess();
      log('auth', `Signup successful: ${email}`);
    } catch (error) {
      report('auth', error);
      toastError(error);
    } finally {
      isLoading = false;
    }
  };
</script>

<form on:submit={handleSubmit}>
  <DialogHeader>
    {$t('common.auth.signupTitle')}
  </DialogHeader>

  <DialogBody>
    <Input
      type="text"
      minlength={2}
      bind:value={name}
      label={$t('common.auth.name')}
      placeholder={$t('common.auth.namePlaceholder')}
      required
      disabled={isLoading}
    />

    <Input
      type="email"
      bind:value={email}
      label={$t('common.auth.email')}
      placeholder={$t('common.auth.emailPlaceholder')}
      required
      disabled={isLoading}
    />

    <Input
      type="password"
      minlength={8}
      bind:value={password}
      label={$t('common.auth.password')}
      placeholder={$t('common.auth.passwordPlaceholder')}
      required
      disabled={isLoading}
    />

    <div class="terms">
      {$t('common.auth.agreeToTerms')}{' '}
      <a data-sveltekit-preload-data="hover" href="/terms" target="_blank">
        {$t('common.auth.terms')}</a
      >
    </div>
  </DialogBody>

  <DialogFooter>
    {#if onCancel}
      <DialogAction handleClick={onCancel} disabled={isLoading}>
        {$t('common.controls.cancel')}
      </DialogAction>
    {/if}

    <DialogAction disabled={isLoading} type="submit">
      {$t('common.auth.signup')}
      {#if isLoading}
        <CircularSpinner absolute />
      {/if}
    </DialogAction>
  </DialogFooter>
</form>

<style lang="scss">
  form {
    padding: 16px 16px 8px;
    width: min(300px, 70vw);

    display: flex;
    flex-direction: column;
    gap: 32px;

    .terms {
      font-size: 13px;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.5);

      a {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
</style>
