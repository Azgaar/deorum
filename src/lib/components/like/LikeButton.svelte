<script lang="ts">
  import { getContext } from 'svelte';

  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import Heart from '$lib/components/icons/Heart.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import { request } from '$lib/utils/requests';

  import type { IGalleryItem } from '$lib/types/gallery.types';
  import type { Carousel } from '../../../routes/(guest)/(characters)/carousel';

  export let item: IGalleryItem;

  const auth: { request: (callback: VoidFunction) => void } = getContext('auth');
  const carousel = getContext<Carousel>('carousel');

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

    const wasLiked = isLiked;
    item.likes = wasLiked ? likesOff : likesOn; // optimistic update

    try {
      await request(`/api/characters/${item.id}/like`, wasLiked ? 'DELETE' : 'POST');
      carousel.update(item);
      invalidate('app:userData');
    } catch (error) {
      item.likes = wasLiked ? likesOn : likesOff; // revert optimistic update
      toastError(error);
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
