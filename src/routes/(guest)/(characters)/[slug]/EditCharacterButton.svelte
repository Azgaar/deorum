<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import Pencil from '$lib/components/icons/Pencil.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { IArchetype, IBackground, ICharacter, IRace, ITag } from '$lib/types/api.types';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import { getLocalCopy } from '$lib/utils/characters';
  import { request } from '$lib/utils/requests';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import type { IEditorData } from './editor';
  import EditorDialog from './EditorDialog.svelte';

  export let item: IGalleryItem;
  let editor = { open: false } as IEditorData;

  const handleEditClick = async () => {
    try {
      const expand = 'race,archetype,background,portraits';

      const characterLocalCopy = getLocalCopy(item.id);
      const characterPromise = characterLocalCopy
        ? Promise.resolve(characterLocalCopy)
        : request<ICharacter>(`/api/characters/${item.id}?expand=${expand}`);

      const [character, racesArray, archetypesArray, backgroundsArray, tagsArray] =
        await Promise.all([
          characterPromise,
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

<ActionButton onClick={handleEditClick}>
  <Wrapper>
    <Pencil width={28} />
    <Tooltip>{$t('common.controls.edit')}</Tooltip>
  </Wrapper>
</ActionButton>

{#if editor.open}<EditorDialog bind:item {...editor} bind:open={editor.open} />{/if}
