<script lang="ts">
  import { t } from '$lib/locales/translations';
  import IconButton from '../../IconButton.svelte';

  import type { ICharacter } from '$lib/types/api.types';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { selectSections } from '$lib/utils/characters';

  export let character: ICharacter;
  export let onChange: (value: string) => void;

  let isLoading = false;
  $: console.log(character);

  const doNothing = () => {
    // do nothing
  };

  const generateBio = () => {
    isLoading = true;

    const sections = selectSections();
    // Biography of a dark fantasy character.
    // Male Elf, 110 years old, height 187, weight 61. Name: Ayas Zylrie. Archetype: lover. Background: spy.
    // Tags: young, male, long-eared, dark-skinned.
    // Contains sections: Family origin, Birthplace, Childhood home, Early Life, Later development, Current occupation, Work motive, Best friend, Marriage, Afraid of, Personality, Life credo, Trinke, Symbol.
    // High quality text, detailed biography in Dark Fantasy style. Dark Fantasy character biography.
  };
</script>

<div class="bio">
  <div class="label">
    <label for="bio">{$t('common.character.bio')}:</label>
    <div>
      <IconButton onClick={doNothing}>⚙️</IconButton>
      {#if isLoading}
        <IconButton disabled onClick={generateBio}>
          <CircularSpinner size={16} />
        </IconButton>
      {:else}
        <IconButton onClick={generateBio}>🎲</IconButton>
      {/if}
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
