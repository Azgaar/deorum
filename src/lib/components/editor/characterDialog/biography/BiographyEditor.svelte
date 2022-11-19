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
  export let tags: Map<string, { name: string }>;
  export let onChange: (value: string) => void;

  let isLoading = false;

  const showOptions = () => {
    // TODO: Implement
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
      const prompt = createBasicPrompt(character, tags);
      const { story } = await request<{ story: string }>('/api/stories', 'POST', { prompt });
      onChange(story.trim());
    } catch (err) {
      report('story generator', err);
      toastError(err);
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="bio">
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
      <IconButton onClick={showOptions}>⚙️</IconButton>
    </div>
  </div>
  <textarea
    id="bio"
    value={character.bio}
    on:input={(e) => onChange(e.currentTarget.value)}
    rows="30"
  />
</div>

<style lang="scss">
  div.bio {
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

    textArea {
      height: 300px;
      padding: 8px;

      background-color: $secondary;
      border: none;
      border-radius: 4px;
      outline: none;

      // reader mode
      font-family: Helvetica, sans-serif;
      font-size: 14px;
      color: #dee7ea;
      line-height: 1.3;
    }
  }
</style>
