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

  export let character: ICharacter;

  $: src = character.portraits.length
    ? `${PORTRAITS_IMAGE_PATH}/${getCharacterImage(character)}`
    : '';

  let uploadInput: HTMLInputElement;

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

  async function uploadPortrait(file: File) {
    try {
      const usedId = $page.data.userId;
      if (!usedId) throw new Error('User not logged in');

      const formData = new FormData();
      const convertedImage = await convertImageFile(file);
      formData.set('user', usedId);
      formData.set('image', convertedImage);
      const portrait = await sendFormData<IPortrait>('/api/portraits', formData, 'POST');
      invalidate(KEYS.USER_DATA);

      character = {
        ...character,
        portraits: [portrait.id],
        '@expand': { ...character['@expand'], portraits: [portrait] }
      };
    } catch (err) {
      report('upload portrait', err, file);
      toastError(err);
    }
  }

  function nextPortrait() {
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

<div class="portrait" on:drop={handleDrop} on:dragover={handleDragover} on:focus={() => {}}>
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
      title={$t('common.details.editor.portrait.upload')}
    >
      <input type="file" accept="image/*" bind:this={uploadInput} on:change={handleUpload} />📁
    </IconButton>

    <IconButton onClick={nextPortrait} title={$t('common.details.editor.portrait.randomize')}>
      🎲
    </IconButton>
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
