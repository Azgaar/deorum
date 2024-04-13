<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import AngleBraces from '$lib/components/icons/AngleBraces.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError, toastSuccess } from '$lib/stores';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;

  const handleEmbedClick = () => {
    const url = `${window.location.origin}/embed/${item.id}`;
    const frame = `<iframe src="${url}" width="375" height="600" frameborder="0"></iframe>`;

    navigator.clipboard.writeText(frame).then(
      () => toastSuccess($t('common.success.copied')),
      () => toastError($t('common.errors.copy'))
    );
  };
</script>

<ActionButton onClick={handleEmbedClick} title={$t('common.controls.embed')}>
  <AngleBraces width={28} />
</ActionButton>
