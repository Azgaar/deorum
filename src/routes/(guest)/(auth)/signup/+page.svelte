<script lang="ts">
  import { goto } from '$app/navigation';
  import SignupForm from '$lib/components/auth/signup/SignupForm.svelte';
  import Metatags from '$lib/components/metatags/Metatags.svelte';
  import { t } from '$lib/locales/translations';

  const onClose = () => {
    goto('/', { invalidateAll: true });
  };
</script>

<Metatags
  title={`${$t('common.meta.name')} | ${$t('common.auth.signup')}`}
  description={$t('common.meta.description')}
  imageSrc="/images/preview.jpg"
/>

<div class="form-wrapper">
  <SignupForm onSuccess={onClose} />
</div>

<style lang="scss">
  .form-wrapper {
    padding: 20px 20px 14px;
  }
</style>
