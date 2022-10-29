<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import { toastError } from '$lib/stores';
  import { t } from '$lib/locales/translations';
  import SigninForm from '$lib/components/auth/signin/SigninForm.svelte';

  onMount(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const unauthorized = searchParams.get('unauthorized');
    if (unauthorized) toastError($t('common.errors.unauthorized'));
  });

  const onClose = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const to = searchParams.get('to');

    goto(to || '/');
  };
</script>

<SigninForm {onClose} />
