<script lang="ts">
  import { invalidate } from '$app/navigation';
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import { confirmationDialog } from '$lib/components/dialog/dialog';
  import Trash from '$lib/components/icons/Trash.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';

  export let item: IGalleryItem;

  const handleClick = () => {
    const removeCharacter = async () => {
      try {
        await request(`/api/custom/${item.id}`, 'DELETE');
        invalidate('app:myCharacters');
      } catch (error) {
        report('character editor', error);
        toastError(error);
      }
    };

    confirmationDialog.open({ onConfirm: removeCharacter });
  };
</script>

<ActionButton onClick={handleClick} title={$t('common.myCharacters.custom.remove')}>
  <Trash width={26} />
</ActionButton>
