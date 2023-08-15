<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import Character from '$lib/components/icons/Character.svelte';
  import { t } from '$lib/locales/translations';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;
</script>

<ActionButton
  onClick={() => (window.location.href = `/admin/characters?filter=(id="${item.id}")`)}
  title={$t('common.controls.openCharacterEditor')}
>
  <Character width={28} />
</ActionButton>
