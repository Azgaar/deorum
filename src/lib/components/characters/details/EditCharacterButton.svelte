<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import Pencil from '$lib/components/icons/Pencil.svelte';
  import { charactersConfig } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { IArchetype, IBackground, ICharacter, IRace, ITag } from '$lib/types/api.types';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import { getContext } from 'svelte';
  import CharacterEditorDialog from '../editor/CharacterEditorDialog.svelte';

  export let item: IGalleryItem;
  let editor = { open: false } as {
    open: boolean;
    character: ICharacter;
    races: Map<string, IRace>;
    archetypes: Map<string, IArchetype>;
    backgrounds: Map<string, IBackground>;
    tags: Map<string, ITag>;
  };

  const auth: { require: (callback: VoidFunction) => void } = getContext('auth');

  const handleEditClick = () =>
    auth.require(async () => {
      try {
        const characterPath = item.creator ? 'custom' : 'characters';
        const [character, racesArray, archetypesArray, backgroundsArray, tagsArray] =
          await Promise.all([
            request<ICharacter>(
              `/api/${characterPath}/${item.id}?expand=${charactersConfig.expand}`
            ),
            request<IRace[]>('/api/races'),
            request<IArchetype[]>('/api/archetypes'),
            request<IBackground[]>('/api/backgrounds'),
            request<ITag[]>('/api/tags')
          ]);

        const races = new Map(racesArray.map((race) => [race.id, race]));
        const archetypes = new Map(archetypesArray.map((archetype) => [archetype.id, archetype]));
        const backgrounds = new Map(
          backgroundsArray.map((background) => [background.id, background])
        );
        const tags = new Map(tagsArray.map((tag) => [tag.id, tag]));
        editor = { open: true, character, races, archetypes, backgrounds, tags };
      } catch (error) {
        report('edit character', error, item);
        toastError(error);
      }
    });
</script>

<ActionButton onClick={handleEditClick} title={$t('common.controls.edit')}>
  <Pencil width={28} />
</ActionButton>

{#if editor.open}
  <CharacterEditorDialog {...editor} bind:isOpen={editor.open} />
{/if}
