<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import Checkbox from '$lib/components/inputs/Checkbox.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { IList, IOriginal, IPortrait } from '$lib/types/api.types';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';

  export let isOpen: boolean;
  export let ids: string[];
  export let onSubmit: (newIds: string[]) => void;

  let page = 1;
  let hasMore = false;
  let portraits: IPortrait[] = [];
  let isLoading = true;

  let original = '';
  let originalOptions: string[][] = [];

  $: onOpen(isOpen);

  const onOpen = async (open: boolean) => {
    if (!open) return;
    if (!portraits.length) loadPortraits();
    if (!originalOptions.length) loadOriginals();
  };

  const loadPortraits = async () => {
    try {
      isLoading = true;
      const filter = original ? `original="${original}"` : '';
      const portraitsList = await request<IList<IPortrait>>(
        `/api/portraits?page=${page}&pageSize=100&filter=${filter}`
      );

      hasMore = portraitsList.totalPages > page;
      portraits = [...portraits, ...portraitsList.items];
    } catch (error) {
      report('character editor', error);
      toastError(error as string);
    } finally {
      isLoading = false;
    }
  };

  const loadOriginals = async () => {
    try {
      const originals = await request<IOriginal[]>('/api/originals');
      const all = ['', $t('common.values.all')];
      const options = originals.map(({ id, name }) => [
        id,
        $t(`admin.originals.${name}`, { default: name })
      ]);
      originalOptions = [all].concat(options);
    } catch (error) {
      report('character editor', error);
      toastError(error as string);
    }
  };

  const handleOriginalChange = (newOriginal: string) => {
    original = newOriginal;
    page = 1;
    portraits = [];
    loadPortraits();
  };

  const loadMore = () => {
    page++;
    loadPortraits();
  };

  const handleCancel = () => {
    isOpen = false;
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const current = Array.from(formData.keys());

    onSubmit(current);
    handleCancel();
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader>
    <div class="title">
      <div>{$t('common.controls.select')} {$t('admin.statistics.portraits').toLowerCase()}</div>
      <Select value={original} options={originalOptions} onChange={handleOriginalChange} />
    </div>
  </DialogHeader>

  <form on:submit={handleSubmit}>
    <DialogBody>
      <div class="content">
        {#each portraits as { id, image } (id)}
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label>
            <img src={`${PORTRAITS_IMAGE_PATH}/${id}/${image}`} alt={id} />
            <div class="checkbox">
              <Checkbox name={id} checked={ids.includes(id)} />
            </div>
          </label>
        {/each}
      </div>
    </DialogBody>

    <DialogFooter>
      {#if isLoading}
        <CircularSpinner size={20} />
      {/if}

      {#if hasMore}
        <DialogAction handleClick={loadMore} disabled={isLoading}>
          {$t('admin.editor.loadMore')}
        </DialogAction>
      {/if}

      <DialogAction handleClick={handleCancel}>
        {$t('common.controls.cancel')}
      </DialogAction>

      <DialogAction type="submit">
        {$t('common.controls.apply')}
      </DialogAction>
    </DialogFooter>
  </form>
</Dialog>

<style lang="scss">
  .title {
    display: grid;
    grid-template-columns: 3fr 1fr;
    align-items: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    div.content {
      height: min(580px, 75vh);
      overflow-y: auto;

      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 3px;

      @media ($mobile) {
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 2px;
      }

      label {
        position: relative;
        cursor: pointer;

        .checkbox {
          position: absolute;
          right: 0;
          bottom: 0;
        }

        img {
          width: 100%;
          aspect-ratio: 1;

          transition: filter 0.2s ease-in-out;
          filter: brightness(0.9);

          &:hover {
            filter: brightness(0.95);
          }
        }
      }
    }
  }
</style>
