<script lang="ts">
  import { goto, invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import { requestConfirmation } from '$lib/components/dialog/provider';
  import Trash from '$lib/components/icons/Trash.svelte';
  import { KEYS } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { hideLoadingOverlay, showLoadingOverlay, toastError } from '$lib/stores';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';

  export let item: IGalleryItem;

  const handleClick = () => {
    const removeCharacter = async () => {
      try {
        showLoadingOverlay();
        await request(`/api/custom/${item.id}`, 'DELETE');

        const isDetailsPage = Boolean($page.params.slug);
        if (isDetailsPage) goto('/library');
        else await invalidate(KEYS.LIBRARY);
      } catch (error) {
        report('character editor', error);
        toastError(error);
      } finally {
        hideLoadingOverlay();
      }
    };

    requestConfirmation({ onConfirm: removeCharacter });
  };
</script>

<ActionButton onClick={handleClick} title={$t('common.library.custom.remove')}>
  <Trash width={26} />
</ActionButton>
