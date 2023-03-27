<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import ArrowRight from '$lib/components/icons/ArrowRight.svelte';
  import { t } from '$lib/locales/translations';

  export let href: string;
</script>

<ActionButton {href} title={$t('common.gallery.showDetails')}>
  <ArrowRight width={32} />
</ActionButton>
