<script lang="ts">
  import { goto } from '$app/navigation';
  import SigninForm from '$lib/components/auth/signin/SigninForm.svelte';
  import Metatags from '$lib/components/metatags/Metatags.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import { onMount } from 'svelte';

  onMount(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const unauthorized = searchParams.get('unauthorized');
    const role = searchParams.get('role');
    if (unauthorized) toastError($t('common.errors.unauthorized', { variable: role }));
  });

  const onSuccess = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const to = searchParams.get('to');
    goto(to || '/', { invalidateAll: true });
  };
</script>

<Metatags
  title={`${$t('common.meta.name')} | ${$t('common.auth.signin')}`}
  description={$t('common.meta.description')}
  imageSrc="/images/preview.jpg"
/>

<div class="form-wrapper">
  <SigninForm {onSuccess} />
</div>

<style lang="scss">
  .form-wrapper {
    padding: 20px 20px 14px;
  }
</style>
