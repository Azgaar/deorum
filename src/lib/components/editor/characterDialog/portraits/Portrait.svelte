<script lang="ts">
  import { onMount } from 'svelte';

  import { getPortrait } from '$lib/api/getPortrait';
  import { toastError } from '$lib/stores';
  import { report } from '$lib/utils/log';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';

  export let id: string;
  export let onClick: () => void;

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
      img.src = `${PORTRAITS_IMAGE_PATH}/${id}/${portrait.image}`;
      img.onload = handleLoad;
      img.onerror = handleError;
    } catch (error) {
      handleError(error);
    }
  });
</script>

<div class="portrait" on:click={onClick}>
  <img bind:this={img} class="portrait" class:hidden={isLoading || isError} alt="portrait" />
  <span>✕</span>
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

    font-size: 18px;
    cursor: pointer;
    user-select: none;

    display: flex;
    justify-content: center;
    align-items: center;

    :nth-child(2) {
      position: absolute;
    }
  }

  img {
    width: 64px;
    height: 64px;
    border-radius: 4px;

    opacity: 1;
    visibility: visible;
    transition: all 0.5s ease-in-out;

    &.hidden {
      opacity: 0;
      visibility: hidden;
    }
  }

  span {
    transition: opacity 0.5s ease-in-out;
    opacity: 0;
    visibility: hidden;
  }

  div.portrait:hover {
    img {
      filter: brightness(0.8);
    }

    span {
      opacity: 1;
      visibility: visible;
    }
  }
</style>
