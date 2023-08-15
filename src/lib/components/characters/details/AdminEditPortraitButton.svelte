<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import Portrait from '$lib/components/icons/Portrait.svelte';
  import { t } from '$lib/locales/translations';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;
  $: portraitId = item.image.split('/')[0];
</script>

<ActionButton
  onClick={() => (window.location.href = `/admin/portraits?filter=(id="${portraitId}")`)}
  title={$t('common.controls.openPortraitEditor')}
>
  <Portrait width={28} />
</ActionButton>
