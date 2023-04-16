<script lang="ts">
  import { getContext } from 'svelte';

  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import Heart from '$lib/components/icons/Heart.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import { controller, request } from '$lib/utils/requests';
  import { KEYS } from '$lib/config';

  export let item: IGalleryItem;

  const auth: { request: (callback: VoidFunction) => void } = getContext('auth');

  $: userId = ($page.data.userId || '') as string;
  $: likesOff = item.likes.filter((likerId) => likerId !== userId);
  $: likesOn = [...likesOff, userId];
  $: isLiked = Boolean(userId && item.likes.includes(userId));

  const handleLikeClick = async () => {
    if (!userId) {
      auth.request(() => {
        if (!isLiked) handleLikeClick();
      });
      return;
    }

    item.likes = isLiked ? likesOff : likesOn; // optimistic update
    controller?.abort(); // cancel previous request if any

    try {
      await request(`/api/characters/${item.id}/like`, isLiked ? 'DELETE' : 'POST');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') toastError(error);
    } finally {
      invalidate(KEYS.USER_DATA);
    }
  };
</script>

<ActionButton onClick={handleLikeClick} title={$t('common.gallery.favorite')}>
  <div class="likeButton">
    <span>{item.likes.length}</span>
    <Heart fill={isLiked ? 'currentColor' : 'none'} width={20} />
  </div>
</ActionButton>

<style lang="scss">
  div.likeButton {
    padding: 3px 6px;
    min-width: 36px;

    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 1px;
  }
</style>
