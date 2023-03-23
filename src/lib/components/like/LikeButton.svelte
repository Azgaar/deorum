<script lang="ts">
  import { getContext } from 'svelte';
  import Tooltip, { Wrapper } from '@smui/tooltip';

  import { t } from '$lib/locales/translations';
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import { toastError } from '$lib/stores';
  import { request } from '$lib/utils/requests';
  import Heart from '$lib/components/icons/Heart.svelte';

  import type { IGalleryItem } from '$lib/types/gallery.types';
  import type { Carousel } from '../../../routes/(guest)/(characters)/carousel';

  export let item: IGalleryItem;
  console.log(item, $page.data.userId);

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

<button class="likeButton" on:click={handleLikeClick}>
  <Wrapper>
    <div>
      <span>{item.likes.length}</span>
      <Heart fill={isLiked ? 'currentColor' : 'none'} width={20} />
    </div>
    <Tooltip>{$t('common.gallery.addToMyCharacters')}</Tooltip>
  </Wrapper>
</button>

<style lang="scss">
  .likeButton {
    outline: none;
    border: none;
    background: none;
    color: $text;
    cursor: pointer;

    div {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
  }
</style>
