<script lang="ts">
  import Metatags from '$lib/components/metatags/Metatags.svelte';
  import { t } from '$lib/locales/translations';
</script>

<Metatags
  title={`${$t('common.meta.name')} | ${$t('common.navigation.match')}`}
  description={$t('common.meta.description')}
  imageSrc="/images/preview.jpg"
/>

<slot />
