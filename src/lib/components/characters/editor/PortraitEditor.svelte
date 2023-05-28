<script lang="ts">
  import { t } from '$lib/locales/translations';
  import IconButton from '$lib/components/editor/IconButton.svelte';
  import type { ICharacter, IPortrait } from '$lib/types/api.types';
  import { KEYS, PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { getCharacterImage } from '$lib/utils/characters';
  import { convertImageFile } from '$lib/utils/images';
  import { report } from '$lib/utils/log';
  import { toastError } from '$lib/stores';
  import { sendFormData } from '$lib/utils/requests';
  import { page } from '$app/stores';
  import { invalidate } from '$app/navigation';
  import { UPLOAD_PORTRAIT_PRICE } from '$lib/config/coins';
  import { openGetCoinsDialog } from '$lib/components/dialog/provider';
  import { fetchSimilar } from './loadSimilarPortraits';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';

  export let character: ICharacter;

  $: src = character.portraits.length
    ? `${PORTRAITS_IMAGE_PATH}/${getCharacterImage(character)}`
    : '';

  let uploadInput: HTMLInputElement;
  let isLoading = false;

  function handleUpload() {
    if (!uploadInput.files) return;
    const file = uploadInput.files[0];
    uploadPortrait(file);
    uploadInput.value = '';
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) uploadPortrait(file);
  }

  function handleDragover(event: DragEvent) {
    event.preventDefault();
  }

  let isPortraitPoolLoadInitiated = false;
  async function loadPortraitsPool() {
    isPortraitPoolLoadInitiated = true;
    isLoading = true;

    const similarPortraits = await fetchSimilar(character);
    let portraits: IPortrait[] = [];

    const currentPortrait = character['@expand'].portraits?.[0];
    if (currentPortrait) {
      const newPortraits = similarPortraits.filter(({ id }) => id !== currentPortrait.id);
      portraits = [currentPortrait, ...newPortraits];
    } else {
      portraits = similarPortraits;
    }

    character = { ...character, '@expand': { ...character['@expand'], portraits } };
    isLoading = false;
  }

  async function uploadPortrait(file: File) {
    try {
      const { userId, coins } = $page.data;
      if (!userId) throw new Error('User not logged in');
      if (!coins || coins < UPLOAD_PORTRAIT_PRICE) return openGetCoinsDialog(coins);

      isLoading = true;
      const formData = new FormData();
      const convertedImage = await convertImageFile(file);
      formData.set('user', userId);
      formData.set('image', convertedImage);
      const portrait = await sendFormData<IPortrait>('/api/portraits', formData, 'POST');
      await invalidate(KEYS.USER_DATA);

      const portraits = character['@expand'].portraits || [];
      character = {
        ...character,
        portraits: [portrait.id],
        '@expand': { ...character['@expand'], portraits: [portrait, ...portraits] }
      };
    } catch (err) {
      report('upload portrait', err, file);
      toastError(err);
    } finally {
      isLoading = false;
    }
  }

  async function nextPortrait() {
    if (!isPortraitPoolLoadInitiated) await loadPortraitsPool();

    const portraits = character['@expand'].portraits;
    if (portraits?.length) {
      const [first, ...rest] = portraits;

      character = {
        ...character,
        portraits: [first.id],
        '@expand': { ...character['@expand'], portraits: [...rest, first] }
      };
    }
  }
</script>

<div class="portrait" on:drop={handleDrop} on:dragover={handleDragover}>
  <svg class="placeholder" width="100%" viewBox="0 0 512 512">
    <rect width="512" height="512" />
  </svg>

  {#if src}
    <img {src} draggable="false" alt="Portrait" />
  {:else}
    <div class="dropZone">
      <div>{$t('common.details.editor.portrait.drop')}</div>
    </div>
  {/if}

  <div class="controls">
    <IconButton
      onClick={() => uploadInput.click()}
      title={$t('common.details.editor.portrait.upload', { variable: UPLOAD_PORTRAIT_PRICE })}
    >
      <input type="file" accept="image/*" bind:this={uploadInput} on:change={handleUpload} />📁
    </IconButton>

    {#if isLoading}
      <IconButton disabled>
        <CircularSpinner size={16} />
      </IconButton>
    {:else}
      <IconButton onClick={nextPortrait} title={$t('common.details.editor.portrait.randomize')}>
        🎲
      </IconButton>
    {/if}
  </div>
</div>

<style lang="scss">
  div.portrait {
    position: relative;

    svg.placeholder {
      fill: $secondary;
      border-radius: 4px;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      aspect-ratio: 1/1;
    }

    div.dropZone {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      > div {
        padding: 16px;
      }
    }

    div.controls {
      position: absolute;
      bottom: 8px;
      right: 8px;

      display: flex;
      gap: 2px;
    }
  }
</style>
