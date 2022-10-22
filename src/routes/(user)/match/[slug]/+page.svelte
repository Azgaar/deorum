<script lang="ts">
  import { onMount } from 'svelte';

  import { t } from '$lib/locales/translations';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import Label from '$lib/components/label/Label.svelte';

  export let data: import('./$types').PageData;

  const { current: portrait, next, tags } = data;

  onMount(() => {
    // preload next portrait and tags
    const nextImage = new Image();
    nextImage.fetchPriority = 'low';
    nextImage.src = `${PORTRAITS_IMAGE_PATH}/${next.id}/${next.image}`;
  });
</script>

<div class="container">
  <section class="portrait">
    <img
      loading="eager"
      src={`${PORTRAITS_IMAGE_PATH}/${portrait.id}/${portrait.image}`}
      alt="portrait"
    />
  </section>

  <section class="tags">
    {#each tags as tag}
      <div class="tag">
        <button class="no">{$t('common.controls.no')}</button>
        <Label label={tag} type="tags" />
        <button class="yes">{$t('common.controls.yes')}</button>
      </div>
    {/each}
  </section>
</div>

<style lang="scss">
  @use 'sass:color';
  div.container {
    width: 320px;
    padding: 1.4rem;
    background-color: $secondary;
    font-size: 20px;

    @media (max-width: 599px) {
      width: 100%;
    }

    section.portrait {
      margin-bottom: 0.4em;

      img {
        width: 100%;
        aspect-ratio: 1;
      }
    }

    section.tags {
      display: flex;
      flex-direction: column;
      gap: 0.4em;

      div.tag {
        display: flex;
        justify-content: space-between;
        gap: 0.4em;

        button {
          border-style: solid;
          border-width: 0 0 2px 0;
          border-color: rgba($color: black, $alpha: 0.3);
          border-radius: 2px;
          width: 3em;
          height: 1.6em;
          font-size: 1em;
          cursor: pointer;

          color: $text;
          font-size: 0.9em;
          transition: all 0.2s ease-in-out;
        }

        button.no {
          background-color: $error;
        }

        button.no:hover {
          background-color: color.adjust($error, $lightness: -10%);
        }

        button.yes {
          background-color: $success;
        }

        button.yes:hover {
          background-color: color.adjust($success, $lightness: -10%);
        }

        button:active {
          border-width: 2px 0 0 0;
        }
      }
    }
  }
</style>
