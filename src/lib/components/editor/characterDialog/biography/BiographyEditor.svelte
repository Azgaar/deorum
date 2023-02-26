<script lang="ts">
  import { t } from '$lib/locales/translations';
  import IconButton from '../../IconButton.svelte';

  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { createBasicPrompt } from '$lib/utils/characters';
  import { request } from '$lib/utils/requests';
  import { toastError, toastSuccess } from '$lib/stores';
  import { report } from '$lib/utils/log';

  import type { ICharacter } from '$lib/types/api.types';

  export let character: ICharacter;
  export let tags: Map<string, { name: string; image: string }>;

  let isLoading = false;
  let showPrompt = false;
  let customPrompt = '';

  const togglePrompt = () => {
    if (showPrompt) {
      showPrompt = false;
      return;
    }

    if (!customPrompt) customPrompt = createBasicPrompt(character, tags);
    showPrompt = true;
  };

  const copyBio = () => {
    navigator.clipboard.writeText(character.bio).then(
      () => toastSuccess($t('admin.success.copied')),
      () => toastError($t('admin.errors.copy'))
    );
  };

  const generateBio = async () => {
    try {
      isLoading = true;
      const prompt = showPrompt && customPrompt ? customPrompt : createBasicPrompt(character, tags);
      const { story } = await request<{ story: string }>('/api/stories', 'POST', { prompt });
      character.bio = story;
    } catch (err) {
      report('story generator', err);
      toastError(err);
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="bioEditor">
  <div class="label">
    <label for="bio">{$t('common.character.bio')}:</label>
    <div>
      <IconButton onClick={copyBio}>📋</IconButton>
      {#if isLoading}
        <IconButton disabled onClick={generateBio}>
          <CircularSpinner size={16} />
        </IconButton>
      {:else}
        <IconButton onClick={generateBio}>🎲</IconButton>
      {/if}
      <IconButton onClick={togglePrompt}>⚙️</IconButton>
    </div>
  </div>

  <div class="textareas">
    {#if showPrompt}<textarea bind:value={customPrompt} />{/if}
    <textarea bind:value={character.bio} />
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
      height: 300px;

      textArea {
        padding: 8px;
        background-color: $secondary;
        border: none;
        border-radius: 4px;
        outline: none;
        flex: 1;

        // reader mode
        font-size: 14px;
        color: #dee7ea;
        line-height: 1.3;
      }
    }
  }
</style>
