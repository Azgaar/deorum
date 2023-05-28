<script lang="ts">
  import { signin } from '$lib/api/auth';
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
  export let onSuccess: VoidFunction;

  let email = '';
  let password = '';

  let isLoading = false;

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    try {
      isLoading = true;
      await signin({ email, password });
      onSuccess();
      log('auth', `Signin successful: ${email}`);
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
    {$t('common.auth.signinTitle')}
  </DialogHeader>

  <DialogBody>
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
  </DialogBody>

  <DialogFooter>
    {#if onCancel}
      <DialogAction handleClick={onCancel} disabled={isLoading}>
        {$t('common.controls.cancel')}
      </DialogAction>
    {/if}

    <DialogAction disabled={isLoading} type="submit">
      {$t('common.auth.signin')}
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
  }
</style>
