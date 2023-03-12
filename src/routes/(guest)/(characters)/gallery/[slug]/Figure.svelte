<script lang="ts">
  import { getContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import Tooltip, { Wrapper } from '@smui/tooltip';

  import { t } from '$lib/locales/translations';
  import { page } from '$app/stores';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { likes, toastError } from '$lib/stores';
  import { request } from '$lib/utils/requests';
  import ArrowRight from '$lib/components/icons/ArrowRight.svelte';
  import LikeButton from '$lib/components/like/LikeButton.svelte';

  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;
  export let isCentral: boolean;
  export let id: string;

  $: race = $t(`common.races.${item.race}`, { default: item.race });
  $: archetype = $t(`common.archetypes.${item.archetype}`, { default: item.archetype });
  $: background = $t(`common.backgrounds.${item.background}`, { default: item.background });

  $: isLiked = Boolean($likes[id]);
  $: totalLikes = item.likes;

  const auth: { request: (callback: VoidFunction) => void } = getContext('auth');

  const handleLikeClick = async () => {
    if (!$page.data.email) {
      auth.request(handleLikeClick);
      return;
    }

    const wasLiked = isLiked;

    // optimistic update
    totalLikes = wasLiked ? totalLikes - 1 : totalLikes + 1;
    likes.toggle(id);

    try {
      await request(`/api/characters/${id}/like`, wasLiked ? 'DELETE' : 'POST');
    } catch (error) {
      // revert optimistic update
      totalLikes = wasLiked ? totalLikes + 1 : totalLikes - 1;
      likes.toggle(id);

      toastError(error);
    }
  };
</script>

<figure>
  <div class="imageContainer">
    <img src={`${PORTRAITS_IMAGE_PATH}/${item.image}`} alt={item.name} draggable="false" />

    {#if isCentral}
      <div class="actions" transition:fade>
        <div>
          <button class="addToMyCharacters" on:click={handleLikeClick}>
            <Wrapper>
              <LikeButton likes={totalLikes} liked={isLiked} />
              <Tooltip>{$t('common.gallery.addToMyCharacters')}</Tooltip>
            </Wrapper>
          </button>
        </div>

        <a class="showDetails" href={`/${id}`}>
          <Wrapper>
            <ArrowRight />
            <Tooltip>{$t('common.gallery.showDetails')}</Tooltip>
          </Wrapper>
        </a>
      </div>
    {/if}
  </div>

  <figcaption>
    <h1>{item.name}</h1>
    <section>
      <div>
        <Wrapper>
          <div>{race}</div>
          <Tooltip>{$t('common.character.race')}: {race}</Tooltip>
        </Wrapper>
      </div>

      <div>
        <Wrapper>
          <div>{archetype}</div>
          <Tooltip>{$t('common.character.archetype')}: {archetype}</Tooltip>
        </Wrapper>
      </div>

      <div>
        <Wrapper>
          <div>{background}</div>
          <Tooltip>{$t('common.character.background')}: {background}</Tooltip>
        </Wrapper>
      </div>
    </section>
  </figcaption>
</figure>

<style lang="scss">
  @use 'sass:color';

  figure {
    position: relative;
    margin: 0;
    padding: 0.6rem 0.6rem 0.8rem;
    background-color: $surface;

    div.imageContainer {
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        aspect-ratio: 1/1;
      }

      div.actions {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;

        a,
        button {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;

          outline: none;
          border: none;
          color: $text;
          cursor: pointer;

          transition: background-color 0.3s ease-in-out;
          background: color.adjust($on-surface, $alpha: -0.6);

          &:hover {
            background: color.adjust($on-surface, $alpha: -0.1);
          }
        }

        .addToMyCharacters {
          top: 0.5rem;
          right: 0.5rem;
          border-radius: 20px;
          width: 64px;
          height: 32px;
        }

        .showDetails {
          padding: 0.5rem;
          bottom: 0.5rem;
          right: 0.5rem;
          border-radius: 50%;
          width: 20px;
          height: 20px;
        }
      }
    }

    figcaption {
      overflow: hidden;
      display: grid;
      grid-template-rows: 3fr 2fr;
      place-items: center;

      h1 {
        font-size: 1.4em;
        margin: 0;
        text-shadow: 0px 0px 1rem black;
      }

      section {
        display: flex;
        gap: 0.5rem;

        > div {
          max-width: 150px;
          padding: 0.4em 1em;
          border-radius: 1em;
          background-color: color.adjust($on-surface, $alpha: -0.1);

          > div {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>
