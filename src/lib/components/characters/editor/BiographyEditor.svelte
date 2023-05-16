<script lang="ts">
  import { page } from '$app/stores';
  import IconButton from '$lib/components/editor/IconButton.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { Role } from '$lib/config';
  import { models } from '$lib/config/story';
  import { t } from '$lib/locales/translations';
  import { toastError, toastSuccess } from '$lib/stores';
  import type { ICharacter } from '$lib/types/api.types';
  import { report } from '$lib/utils/log';
  import { stream } from '$lib/utils/requests';
  import { createBasicPrompt } from '$lib/utils/story';

  export let character: ICharacter;
  export let tags: Map<string, { name: string; image: string }>;

  let isLoading = false;
  let showPrompt = false;
  let prompt = '';
  let model = models[0].key;

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

      character.bio = '';
      const onData = (dataChunk: string) => {
        character.bio += dataChunk;
      };
      const onComplete = () => {
        character.bio = character.bio.trim();
        isLoading = false;
      };

      await stream('/api/stories', { prompt, model }, onData, onComplete);
    } catch (err) {
      isLoading = false;
      report('story generator', err);
      toastError(err);
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
    {#if showPrompt}
      <div>
        <textarea bind:value={prompt} />
        <div class="modelSelect">
          <Select
            bind:value={model}
            options={models.map(({ key, label, description }) => [
              key,
              `${label} (${$t(description)})`
            ])}
          />
        </div>
      </div>
    {/if}

    <div>
      <textarea bind:value={character.bio} disabled={isLoading} />
    </div>
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

      div {
        flex: 1;
        position: relative;
        display: flex;
        flex-direction: column;

        textArea {
          flex: 1;
          padding: 8px 8px 24px;
          background-color: rgba($secondary, 0.6);
          border: none;
          border-radius: 4px;
          outline: none;
          resize: none;

          // reader mode
          font-size: 14px;
          color: #dee7ea;
          line-height: 1.3;
        }

        .modelSelect {
          position: absolute;
          bottom: 0;
          width: 100%;
        }
      }
    }
  }
</style>
