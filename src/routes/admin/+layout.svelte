<script lang="ts">
  import Metatags from '$lib/components/metatags/Metatags.svelte';
  import { t } from '$lib/locales/translations';
</script>

<Metatags
  title={`${$t('common.meta.name')} | ${$t('common.navigation.admin')}`}
  description={$t('common.meta.description')}
  imageSrc="/images/preview.jpg"
/>

<main>
  <slot />
</main>

<style lang="scss">
  @use 'sass:color';

  main {
    height: 100vh;
    overflow: hidden;
    user-select: none;

    display: grid;
    grid-template-columns: 3fr minmax(360px, 1fr);
    grid-template-areas: 'gallery pane';

    @media ($mobile) {
      grid-template-columns: 1fr;
      grid-template-rows: 3fr 1fr;
      grid-template-areas: 'pane' 'gallery';
    }
  }
</style>
