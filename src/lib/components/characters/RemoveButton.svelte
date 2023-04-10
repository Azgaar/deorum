<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import ArrowRight from '$lib/components/icons/ArrowRight.svelte';
  import { t } from '$lib/locales/translations';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;

  const onClick = () => {
    console.log('Remove', item);
  };
</script>

<ActionButton {onClick} title={$t('common.myCharacters.remove')}>
  <ArrowRight width={32} />
</ActionButton>
