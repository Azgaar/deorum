<script lang="ts">
  import { onMount } from 'svelte';

  import { getPortrait } from '$lib/api/getPortrait';
  import { toastError } from '$lib/stores';
  import { report } from '$lib/utils/log';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';

  export let id: string;
  export let actions: {
    makeFirst: (id: string) => void;
    moveLeft: (id: string) => void;
    moveRight: (id: string) => void;
    remove: (id: string) => void;
    makeLast: (id: string) => void;
  };

  let img: HTMLImageElement | null = null;
  let isLoading = true;
  let isError = false;

  onMount(async () => {
    if (!img) return null;

    const handleLoad = () => {
      isLoading = false;
      isError = false;
    };

    const handleError = (error: unknown) => {
      isLoading = false;
      isError = true;

      report('character editor', error);
      toastError(error as string);
    };

    try {
      const portrait = await getPortrait({ id });
      img.src = `${PORTRAITS_IMAGE_PATH}/${id}/${portrait.image}?thumb=100x100`;
      img.onload = handleLoad;
      img.onerror = handleError;
    } catch (error) {
      handleError(error);
    }
  });

  const handleAction = (action: keyof typeof actions) => {
    actions[action](id);
  };
</script>

<div class="portrait">
  <img bind:this={img} class="portrait" class:hidden={isLoading || isError} alt="portrait" />
  <div class="buttons">
    <button type="button" on:click={() => handleAction('makeFirst')}>▲</button>
    <button type="button" on:click={() => handleAction('moveLeft')}>◀</button>
    <button type="button" on:click={() => handleAction('remove')}>✕</button>
    <button type="button" on:click={() => handleAction('moveRight')}>▶</button>
    <button type="button" on:click={() => handleAction('makeLast')}>▼</button>
  </div>

  {#if isLoading}
    <CircularSpinner absolute />
  {/if}
</div>

<style lang="scss">
  div.portrait {
    position: relative;
    min-width: 64px;
    min-height: 64px;

    background-color: $secondary;
    border-radius: 4px;

    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 64px;
      height: 64px;
      border-radius: 4px;

      opacity: 1;
      visibility: visible;
      transition: all 0.5s ease-in-out;
      transition-delay: 0.5s;

      &.hidden {
        opacity: 0;
        visibility: hidden;
      }
    }

    div.buttons {
      position: absolute;
      font-size: 16px;
      font-weight: 900;
      transition: opacity 0.5s ease-in-out;
      transition-delay: 0.5s;
      opacity: 0;
      visibility: hidden;

      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      grid-template-areas:
        '. top .'
        'left center right'
        '. bottom .';

      justify-content: center;
      align-items: center;
      gap: 1px;

      button:nth-child(1) {
        grid-area: top;
      }

      button:nth-child(2) {
        grid-area: left;
      }

      button:nth-child(3) {
        grid-area: center;
        font-size: 16px;
      }

      button:nth-child(4) {
        grid-area: right;
      }

      button:nth-child(5) {
        grid-area: bottom;
      }

      button {
        border: none;
        background: none;
        color: $text;
        padding: 3px;
        line-height: 1;
        cursor: pointer;

        &:hover {
          color: $primary;
        }
      }
    }
  }

  div.portrait:hover {
    img {
      filter: brightness(0.8);
    }

    div.buttons {
      opacity: 1;
      visibility: visible;
    }
  }
</style>
