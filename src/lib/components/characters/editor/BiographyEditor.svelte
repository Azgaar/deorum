<script lang="ts">
  import { t } from '$lib/locales/translations';
  import IconButton from '$lib/components/editor/IconButton.svelte';

  import { page } from '$app/stores';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { stream } from '$lib/utils/requests';
  import { createBasicPrompt } from '$lib/utils/story';
  import { toastError, toastSuccess } from '$lib/stores';
  import { report } from '$lib/utils/log';
  import { Role } from '$lib/config';
  import type { ICharacter } from '$lib/types/api.types';

  export let character: ICharacter;
  export let tags: Map<string, { name: string; image: string }>;

  let isLoading = false;
  let showPrompt = false;
  let prompt = '';

  const togglePrompt = () => {
    if (showPrompt) {
      showPrompt = false;
      return;
    }

    if (!prompt) prompt = createBasicPrompt(character, tags);
    showPrompt = true;
  };

  const copyBio = () => {
    navigator.clipboard.writeText(character.bio).then(
      () => toastSuccess($t('common.success.copied')),
      () => toastError($t('common.errors.copy'))
    );
  };

  const generateBio = async () => {
    try {
      isLoading = true;

      if (!showPrompt) prompt = createBasicPrompt(character, tags);
      const onData = (dataChunk: string) => {
        character.bio += dataChunk;
      };
      character.bio = '';
      await stream('/api/stories', { prompt }, onData);
    } catch (err) {
      report('story generator', err);
      toastError(err);
    } finally {
      isLoading = false;
      character.bio = character.bio.trim();
    }
  };
</script>

<div class="bioEditor">
  <div class="label">
    <label for="bio">{$t('common.character.bio')}:</label>
    <div>
      <IconButton onClick={copyBio} title={$t('common.details.editor.bio.copy')}>📋</IconButton>

      {#if $page.data.role === Role.ADMIN}
        {#if isLoading}
          <IconButton disabled onClick={generateBio}>
            <CircularSpinner size={16} />
          </IconButton>
        {:else}
          <IconButton onClick={generateBio} title={$t('common.details.editor.bio.generate')}
            >🎲</IconButton
          >
        {/if}

        <IconButton onClick={togglePrompt} title={$t('common.details.editor.bio.configurePrompt')}
          >⚙️</IconButton
        >
      {/if}
    </div>
  </div>

  <div class="textareas">
    {#if showPrompt}<textarea bind:value={prompt} />{/if}
    <textarea bind:value={character.bio} disabled={isLoading} />
  </div>
</div>

<style lang="scss">
  div.bioEditor {
    display: flex;
    flex-direction: column;
    gap: 2px;

    div.label {
      display: flex;
      justify-content: space-between;

      div {
        display: flex;
        align-items: center;
      }
    }

    div.textareas {
      display: flex;
      gap: 8px;

      @media ($desktop) {
        height: 300px;
      }

      @media ($mobile) {
        flex-direction: column;
        height: 200px;
      }

      textArea {
        padding: 8px;
        background-color: $secondary;
        border: none;
        border-radius: 4px;
        outline: none;
        flex: 1;
        resize: none;

        // reader mode
        font-size: 14px;
        color: #dee7ea;
        line-height: 1.3;
      }
    }
  }
</style>
