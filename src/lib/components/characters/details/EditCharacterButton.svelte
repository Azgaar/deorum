<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import Pencil from '$lib/components/icons/Pencil.svelte';
  import { charactersConfig } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { IArchetype, IBackground, ICharacter, IRace, ITag } from '$lib/types/api.types';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import { request } from '$lib/utils/requests';
  import EditorDialog from '../editor/EditorDialog.svelte';

  export let item: IGalleryItem;
  let editor = { open: false } as {
    open: boolean;
    character: ICharacter;
    races: Map<string, IRace>;
    archetypes: Map<string, { name: string }>;
    backgrounds: Map<string, { name: string }>;
    tags: Map<string, { name: string; image: string }>;
  };

  const handleEditClick = async () => {
    try {
      const [character, racesArray, archetypesArray, backgroundsArray, tagsArray] =
        await Promise.all([
          request<ICharacter>(`/api/characters/${item.id}?expand=${charactersConfig.expand}`),
          request<IRace[]>('/api/races'),
          request<IArchetype[]>('/api/archetypes'),
          request<IBackground[]>('/api/backgrounds'),
          request<ITag[]>('/api/tags')
        ]);

      const races = new Map(racesArray.map((race) => [race.id, race]));
      const archetypes = new Map(archetypesArray.map(({ id, name }) => [id, { name }]));
      const backgrounds = new Map(backgroundsArray.map(({ id, name }) => [id, { name }]));
      const tags = new Map(tagsArray.map(({ id, image, name }) => [id, { image, name }]));
      editor = { open: true, character, races, archetypes, backgrounds, tags };
    } catch (error) {
      toastError(error);
    }
  };
</script>

<ActionButton onClick={handleEditClick} title={$t('common.controls.edit')}>
  <Pencil width={28} />
</ActionButton>

{#if editor.open}<EditorDialog {...editor} bind:open={editor.open} />{/if}
