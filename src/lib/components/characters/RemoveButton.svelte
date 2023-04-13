<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import { confirmationDialog } from '$lib/components/dialog/dialog';
  import Trash from '$lib/components/icons/Trash.svelte';
  import { t } from '$lib/locales/translations';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;

  const handleClick = () => {
    const removeCharacter = () => {
      console.log('confirm', item);
    };

    confirmationDialog.open({ onConfirm: removeCharacter });
  };
</script>

<ActionButton onClick={handleClick} title={$t('common.myCharacters.remove')}>
  <Trash width={26} />
</ActionButton>
