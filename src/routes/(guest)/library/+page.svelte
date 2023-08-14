<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import Actions from '$lib/components/actions/Actions.svelte';
  import Card from '$lib/components/characters/Card.svelte';
  import CharacterEditorDialog from '$lib/components/characters/editor/CharacterEditorDialog.svelte';
  import { openGetCoinsDialog, requestConfirmation } from '$lib/components/dialog/provider';
  import Trash from '$lib/components/icons/Trash.svelte';
  import Metatags from '$lib/components/metatags/Metatags.svelte';
  import Picture from '$lib/components/picture/Picture.svelte';
  import { KEYS, PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { GENERATE_BIO_PRICE } from '$lib/config/coins';
  import { blankCharacter } from '$lib/data/characters';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { IArchetype, IBackground, ICharacter, IRace, ITag } from '$lib/types/api.types';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import type { PageData } from './$types';

  export let data: PageData;
  $: custom = data.library.custom;
  $: uploaded = data.library.uploaded;
  $: liked = data.library.liked;

  let editor = { isOpen: false } as {
    isOpen: boolean;
    character: ICharacter;
    races: Map<string, IRace>;
    archetypes: Map<string, IArchetype>;
    backgrounds: Map<string, IBackground>;
    tags: Map<string, ITag>;
  };

  const handleCreate = async () => {
    const coinsLeft = $page.data.coins;
    if (!coinsLeft || coinsLeft < GENERATE_BIO_PRICE) return openGetCoinsDialog(coinsLeft);

    try {
      const [racesArray, archetypesArray, backgroundsArray, tagsArray] = await Promise.all([
        request<IRace[]>('/api/races'),
        request<IArchetype[]>('/api/archetypes'),
        request<IBackground[]>('/api/backgrounds'),
        request<ITag[]>('/api/tags')
      ]);

      const races = new Map(racesArray.map((race) => [race.id, race]));
      const archetypes = new Map(archetypesArray.map((archetype) => [archetype.id, archetype]));
      const backgrounds = new Map(backgroundsArray.map((back) => [back.id, back]));
      const tags = new Map(tagsArray.map((tag) => [tag.id, tag]));

      const character = blankCharacter;
      editor = { isOpen: true, character, races, archetypes, backgrounds, tags };
    } catch (error) {
      report('create character', error);
      toastError(error);
    }
  };

  const handleRemoveUploaded = async (id: string) => {
    const removePortrait = async () => {
      try {
        await request(`/api/portraits/${id}`, 'DELETE');
        await invalidate(KEYS.LIBRARY);
      } catch (error) {
        report('remove uploaded portrait', error, { id });
        toastError(error);
      }
    };

    requestConfirmation({ onConfirm: removePortrait });
  };
</script>

<Metatags
  title={`${$t('common.meta.name')} | ${$t('common.navigation.library')}`}
  description={$t('common.meta.description')}
  imageSrc="/images/preview.jpg"
/>

<div class="wrapper" aria-label="library content">
  <section aria-label="custom characters">
    <header>
      <h2>{$t('common.library.custom.title')} ({custom.length})</h2>
      <button on:click={handleCreate}>
        {$t('common.library.custom.create')}
      </button>
    </header>

    {#if custom.length === 0}
      <p class="empty">{$t('common.library.custom.empty')}</p>
    {:else}
      <div class="grid">
        {#each custom as item (item.id)}
          <Card {item} actionable />
        {/each}
      </div>
    {/if}
  </section>

  {#if uploaded.length > 0}
    <section aria-label="uploaded characters">
      <header>
        <h2>{$t('common.library.uploaded.title')} ({uploaded.length})</h2>
      </header>

      <div class="grid">
        {#each uploaded as portrait (portrait.id)}
          <figure class="uploadedPortrait">
            <div>
              <Picture
                src={`${PORTRAITS_IMAGE_PATH}/${portrait.id}/${portrait.image}`}
                alt="Uploaded portrait"
              />

              <Actions>
                <div slot="top">
                  <ActionButton
                    onClick={() => handleRemoveUploaded(portrait.id)}
                    title={$t('common.library.uploaded.remove')}
                  >
                    <Trash width={26} />
                  </ActionButton>
                </div>
              </Actions>
            </div>
          </figure>
        {/each}
      </div>
    </section>
  {/if}

  <section aria-label="liked characters">
    <header>
      <h2>{$t('common.library.liked.title')} ({liked.length})</h2>
      <a href="/gallery" data-sveltekit-preload-data={'hover'}>
        {$t('common.library.liked.goToGallery')}
      </a>
    </header>

    {#if liked.length === 0}
      <p class="empty">{$t('common.library.liked.empty')}</p>
    {:else}
      <div class="grid">
        {#each liked as item (item.id)}
          <Card {item} actionable />
        {/each}
      </div>
    {/if}
  </section>
</div>

{#if editor.isOpen}<CharacterEditorDialog {...editor} bind:isOpen={editor.isOpen} />{/if}

<style lang="scss">
  div.wrapper {
    padding: 16px 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 4px;
      margin-bottom: 8px;

      h2 {
        font-size: 1.2rem;
        font-weight: 400;
        text-shadow: 0px 0px 6px black;
        margin: 0;
      }

      button,
      a {
        padding: 0;
        background: none;
        border: none;
        text-transform: uppercase;
        text-decoration: underline;
        font-size: 0.8rem;
        text-shadow: 0px 0px 1rem black;
        cursor: pointer;

        color: $text;
        transition: color 0.2s ease-in-out;

        &:hover {
          color: #999999;
        }
      }
    }

    .empty {
      font-size: 0.9rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      grid-gap: 8px;

      font-size: 0.8rem;

      .uploadedPortrait {
        margin: 0;
        padding: 0.6rem 0.6rem 0.8rem;
        background-color: $surface;

        div {
          position: relative;
        }
      }
    }
  }
</style>
