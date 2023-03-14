<script lang="ts">
  import { getContext } from 'svelte';
  import Tooltip, { Wrapper } from '@smui/tooltip';

  import { t } from '$lib/locales/translations';
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import { likes, toastError } from '$lib/stores';
  import { request } from '$lib/utils/requests';
  import Heart from '$lib/components/icons/Heart.svelte';

  import type { IGalleryItem } from '$lib/types/gallery.types';
  import type { Carousel } from '../../../routes/(guest)/(characters)/carousel';

  export let item: IGalleryItem;

  const auth: { request: (callback: VoidFunction) => void } = getContext('auth');
  const carousel = getContext<Carousel>('carousel');

  const handleLikeClick = async () => {
    if (!$page.data.email) {
      auth.request(() => {
        if (!$likes[item.id]) handleLikeClick();
      });
      return;
    }

    const wasLiked = $likes[item.id];

    // optimistic update
    item.likes = wasLiked ? item.likes - 1 : item.likes + 1;
    likes.toggle(item.id);

    try {
      await request(`/api/characters/${item.id}/like`, wasLiked ? 'DELETE' : 'POST');
      carousel.update(item);
      invalidate('userData');
    } catch (error) {
      // revert optimistic update
      item.likes = wasLiked ? item.likes + 1 : item.likes - 1;
      likes.toggle(item.id);

      toastError(error);
    }
  };
</script>

<button class="likeButton" on:click={handleLikeClick}>
  <Wrapper>
    <div>
      <span>{item.likes}</span>
      <Heart fill={$likes[item.id] ? 'currentColor' : 'none'} width={20} />
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
