<script lang="ts">
  import { browser } from '$app/environment';

  import { t } from '$lib/locales/translations';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { patchPortrait } from '$lib/api/patchPortrait';
  import Label from '$lib/components/label/Label.svelte';

  import type { IPortrait } from '$lib/types/api.types';

  export let data: import('./$types').PageData;
  $: key = data.current.id;
  $: preloadNextImage(data.next);

  function preloadNextImage(next: IPortrait) {
    if (browser) {
      const nextImage = new Image();
      nextImage.fetchPriority = 'low';
      nextImage.src = `${PORTRAITS_IMAGE_PATH}/${next.id}/${next.image}`;
    }
  }

  const handleClick = (event: MouseEvent, add: boolean, tagId: string) => {
    patchPortrait(key, add, tagId);

    const target = event.target as HTMLElement;
    target.classList.add('clicked');
  };
</script>

<div class="container">
  <section class="portrait">
    {#key key}
      <img
        src={`${PORTRAITS_IMAGE_PATH}/${data.current.id}/${data.current.image}`}
        alt="portrait"
      />
    {/key}
  </section>

  <section class="tags">
    {#each data.tags as tag (data.current.id + tag.id)}
      <div class="tag">
        <button
          class="no"
          class:clicked={false}
          on:click={(event) => handleClick(event, false, tag.id)}
        >
          {$t('common.controls.no')}
        </button>

        <Label label={tag} type="tags" />

        <button
          class="yes"
          class:clicked={false}
          on:click={(event) => handleClick(event, true, tag.id)}
        >
          {$t('common.controls.yes')}
        </button>
      </div>
    {/each}
  </section>
</div>

<style lang="scss">
  @use 'sass:color';
  div.container {
    width: min(320px, 100%);
    padding: 1.4rem;
    background-color: $secondary;
    font-size: 20px;

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
          opacity: 1;
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

        button.clicked {
          pointer-events: none;
          opacity: 0;
        }
      }
    }
  }
</style>
