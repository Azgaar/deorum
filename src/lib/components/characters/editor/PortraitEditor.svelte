<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import { openGetCoinsDialog } from '$lib/components/dialog/provider';
  import IconButton from '$lib/components/editor/IconButton.svelte';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { KEYS, PORTRAITS_IMAGE_PATH, PORTRAIT_SIZE, Role } from '$lib/config';
  import { UPLOAD_PORTRAIT_PRICE } from '$lib/config/coins';
  import { IMAGE_GENERATION_PRICE } from '$lib/config/image';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { ICharacter, IPortrait } from '$lib/types/api.types';
  import { getCharacterImage } from '$lib/utils/characters';
  import { convertImageFile, createImagePrompt } from '$lib/utils/images';
  import { report } from '$lib/utils/log';
  import { request, sendFormData } from '$lib/utils/requests';
  import { fetchSimilar } from './loadSimilarPortraits';

  export let character: ICharacter;
  export let isPortraitPoolLoaded: boolean;

  $: src = character.portraits.length
    ? `${PORTRAITS_IMAGE_PATH}/${getCharacterImage(character)}`
    : '';

  let uploadInput: HTMLInputElement;
  let isLoading = false;
  const isAdmin = $page.data.role === Role.ADMIN;

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

  async function loadPortraitsPool() {
    isPortraitPoolLoaded = true;
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
      if (!file.type.startsWith('image/'))
        throw new Error('Invalid file type, only images are allowed');

      const { userId, coins } = $page.data;
      if (!userId) throw new Error('User not logged in');
      if (!coins || coins < UPLOAD_PORTRAIT_PRICE) return openGetCoinsDialog(coins);

      isLoading = true;

      const convertedImage = await convertImageFile(file);
      const formData = new FormData();
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

  async function selectNextPortaitFromPool() {
    if (!isPortraitPoolLoaded) await loadPortraitsPool();

    const portraits = character['@expand'].portraits || [];
    if (portraits.length > 1) {
      const [first, second, ...rest] = portraits;

      character = {
        ...character,
        portraits: [second.id],
        '@expand': { ...character['@expand'], portraits: [second, ...rest, first] }
      };
    }
  }

  async function generatePortrait() {
    try {
      const { userId, coins } = $page.data;
      if (!userId) throw new Error('User not logged in');
      if (!coins || coins < IMAGE_GENERATION_PRICE) return openGetCoinsDialog(coins);

      isLoading = true;

      const prompt = createImagePrompt(character);
      const { url } = await request<{ url: string }>('/api/images/generate', 'POST', {
        prompt
      });
      console.log(url);
      await invalidate(KEYS.USER_DATA);

      isLoading = false;
    } catch (err) {
      report('generate portrait', err);
      toastError(err);
    } finally {
      isLoading = false;
    }
  }
</script>

<figure class="portrait" on:drop={handleDrop} on:dragover={handleDragover}>
  <svg class="placeholder" width="100%" viewBox={`0 0 ${PORTRAIT_SIZE} ${PORTRAIT_SIZE}`}>
    <rect width={PORTRAIT_SIZE} height={PORTRAIT_SIZE} />
  </svg>

  {#if src}
    <img {src} draggable="false" alt="Portrait" />
  {:else}
    <div class="dropZone">
      <div>{$t('common.details.editor.portrait.drop')}</div>
    </div>
  {/if}

  <div class="controls">
    {#if isLoading}
      <IconButton disabled>
        <CircularSpinner size={16} />
      </IconButton>
    {:else}
      <IconButton
        onClick={() => uploadInput.click()}
        title={$t('common.details.editor.portrait.upload', { variable: UPLOAD_PORTRAIT_PRICE })}
      >
        <input
          type="file"
          accept="image/*"
          hidden
          bind:this={uploadInput}
          on:change={handleUpload}
        />📁
      </IconButton>

      <IconButton
        onClick={selectNextPortaitFromPool}
        title={$t('common.details.editor.portrait.randomize')}
      >
        🎲
      </IconButton>
      {#if isAdmin}
        <IconButton
          onClick={generatePortrait}
          title={$t('common.details.editor.portrait.generate', {
            variable: IMAGE_GENERATION_PRICE
          })}
        >
          🤖
        </IconButton>
      {/if}
    {/if}
  </div>
</figure>

<style lang="scss">
  figure.portrait {
    position: relative;
    margin: 0;

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
