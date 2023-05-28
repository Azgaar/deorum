<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import Checkbox from '$lib/components/inputs/Checkbox.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { charactersConfig } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { ICharacter, IList, IRace } from '$lib/types/api.types';
  import { deriveCharacterLabel, derivePrimaryImagePath } from '$lib/utils/characters';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';

  export let isOpen: boolean;
  export let currentIds: string[];
  export let onSubmit: (characters: ICharacter[]) => void;
  export let races: Map<string, IRace>;

  let page = 1;
  let hasMore = false;
  let characters: ICharacter[] = [];
  let isLoading = true;

  let race = '';

  const all = ['', $t('common.values.all')];
  const options = Array.from(races).map(([id, { name }]) => [id, $t(`common.races.${name}`)]);
  const raceOptions = [all].concat(options);

  $: onOpen(isOpen);

  const onOpen = (open: boolean) => {
    if (!open) return;
    loadCharacters([]);
  };

  const loadCharacters = async (currentCharacters: ICharacter[]) => {
    try {
      isLoading = true;
      const pageSize = 100;
      const filter = race ? `race="${race}"` : '';
      const url = `/api/characters?page=${page}&pageSize=${pageSize}&filter=${filter}&expand=${charactersConfig.expand}`;
      const charactersList = await request<IList<ICharacter>>(url);

      hasMore = charactersList.totalPages > page;
      characters = [...currentCharacters, ...charactersList.items];
    } catch (error) {
      report('character selector', error);
      toastError(error);
    } finally {
      isLoading = false;
    }
  };

  const handleRaceChange = (newRace: string) => {
    characters = [];
    race = newRace;
    page = 1;
    loadCharacters([]);
  };

  const loadMore = () => {
    page++;
    loadCharacters(characters);
  };

  const handleCancel = () => {
    isOpen = false;
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const currentIds = Array.from(formData.keys());

    const selected = characters.filter(({ id }) => currentIds.includes(id));
    onSubmit(selected);
    handleCancel();
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader>
    <div class="title">
      <div>{$t('common.controls.select')} {$t('admin.editor.characters').toLowerCase()}</div>
      <Select value={race} options={raceOptions} onChange={handleRaceChange} />
    </div>
  </DialogHeader>

  <form on:submit={handleSubmit}>
    <DialogBody>
      <ul class="list">
        {#each characters as character (character.id)}
          <li>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>
              <Checkbox name={character.id} checked={currentIds.includes(character.id)} />
              <span class="label">
                <img src={derivePrimaryImagePath(character)} alt={character.name} />
                {deriveCharacterLabel(character)}
              </span>
            </label>
          </li>
        {/each}
      </ul>
    </DialogBody>

    <DialogFooter>
      {#if isLoading}
        <CircularSpinner size={20} />
      {/if}

      {#if hasMore}
        <DialogAction disabled={isLoading} handleClick={loadMore}>
          {$t('admin.editor.loadMore')}
        </DialogAction>
      {/if}

      <DialogAction handleClick={handleCancel}>
        {$t('common.controls.close')}
      </DialogAction>

      <DialogAction type="submit">
        {$t('common.controls.apply')}
      </DialogAction>
    </DialogFooter>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  .title {
    display: grid;
    grid-template-columns: 3fr 1fr;
    align-items: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    ul.list {
      max-height: min(560px, 80vh);
      overflow: auto;
      margin: 0;
      padding: 0;

      display: flex;
      flex-direction: column;
      gap: 2px;

      li {
        list-style: none;

        label {
          display: flex;
          align-items: center;

          span.label {
            display: grid;
            grid-template-columns: 40px 1fr;
            grid-gap: 8px;
            align-items: center;

            img {
              width: 100%;
              aspect-ratio: 1/1;
            }
          }
        }
      }
    }
  }
</style>
