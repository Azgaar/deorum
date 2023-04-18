<script lang="ts">
  import { t } from '$lib/locales/translations';
  import IconButton from '$lib/components/editor/IconButton.svelte';
  import type { ICharacter } from '$lib/types/api.types';
  import { KEYS, PORTRAITS_IMAGE_PATH } from '$lib/config';
  import Picture from '$lib/components/picture/Picture.svelte';
  import { getCharacterImage } from '$lib/utils/characters';
  import { loadSimilarPortraits } from './loadSimilarPortraits';

  export let character: ICharacter;

  $: src = character.portraits.length
    ? `${PORTRAITS_IMAGE_PATH}/${getCharacterImage(character)}`
    : '';

  let uploadInput: HTMLInputElement;
  function handleUpload() {
    if (!uploadInput.files) return;
    const file = uploadInput.files[0];
    console.log(file);
  }

  function randomizePortrait() {
    const portraits = character['@expand'].portraits;
    if (portraits?.length) {
      const [first, ...rest] = portraits;
      const newPortraits = [...rest, first];

      character = {
        ...character,
        portraits: newPortraits.map(({ id }) => id),
        '@expand': { ...character['@expand'], portraits: newPortraits }
      };
    }
  }

  async function preloadMorePortraits() {
    const portraits = await loadSimilarPortraits(character);
    character = { ...character, '@expand': { ...character['@expand'], portraits } };
  }
</script>

<div class="portrait" on:mouseover|once={preloadMorePortraits} on:focus={() => {}}>
  <Picture {src} alt="Character portrait" />

  <div class="controls">
    <IconButton
      onClick={() => uploadInput.click()}
      title={$t('common.details.editor.portrait.upload')}
    >
      <input type="file" accept="image/*" bind:this={uploadInput} on:change={handleUpload} />📁
    </IconButton>

    <IconButton onClick={randomizePortrait} title={$t('common.details.editor.portrait.randomize')}
      >🎲
    </IconButton>
  </div>
</div>

<style lang="scss">
  div.portrait {
    position: relative;

    div.controls {
      position: absolute;
      bottom: 8px;
      right: 8px;

      display: flex;
      gap: 2px;
    }
  }
</style>
