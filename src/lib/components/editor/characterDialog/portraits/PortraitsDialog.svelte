<script lang="ts">
  import Dialog, { type DialogComponentDev } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Checkbox from '@smui/checkbox';

  import { t } from '$lib/locales/translations';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { getPortraits } from '$lib/api/getPortraits';
  import { getFullList } from '$lib/api/getFullList';
  import { report } from '$lib/utils/log';
  import { toastError } from '$lib/stores';
  import Select from '$lib/components/inputs/Select.svelte';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';

  import type { IPortrait } from '$lib/types/api.types';

  export let open: boolean;
  export let ids: string[];

  let page = 1;
  let hasMore = false;
  let portraits: IPortrait[] = [];
  let isLoading = true;

  let original = '';
  let originalOptions: string[][] = [];

  $: onOpen(open);

  const onOpen = async (open: boolean) => {
    if (!open) return;
    if (!portraits.length) loadPortraits();
    if (!originalOptions.length) loadOriginals();
  };

  const loadPortraits = async () => {
    try {
      isLoading = true;
      const filter = original ? `original="${original}"` : '';
      const portraitsList = await getPortraits({ page, filter });
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
      const originals = await getFullList<'originals'>('originals');
      const all = ['', $t('common.values.all')];
      const options = originals.map(({ id, name }) => [id, $t(`admin.originals.${name}`)]);
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

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    open = false;
  };
</script>

<Dialog bind:open aria-labelledby="portraits-dialog" aria-describedby="portraits-dialog">
  <section class="title">
    <div>{$t('common.controls.select')} {$t('admin.statistics.portraits').toLowerCase()}</div>
    <Select value={original} options={originalOptions} onChange={handleOriginalChange} />
  </section>

  <form class="body" on:submit={handleSubmit}>
    <div class="content">
      <div>
        {#each portraits as { id, image } (id)}
          <div>
            <img src={`${PORTRAITS_IMAGE_PATH}/${id}/${image}?thumb=100x100`} alt={id} />
            <div class="checkbox" aria-checked={ids.includes(id)}>
              <Checkbox bind:group={ids} value={id} />
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="actions">
      {#if isLoading}
        <CircularSpinner size={20} />
      {/if}

      {#if hasMore}
        <Button type="button" style="color: white" disabled={isLoading} on:click={loadMore}>
          <Label>{$t('admin.editor.loadMore')}</Label>
        </Button>
      {/if}

      <Button type="submit" style="color: white">
        <Label>{$t('common.controls.close')}</Label>
      </Button>
    </div>
  </form>
</Dialog>

<style lang="scss">
  section.title {
    height: 40px;
    font-size: large;
    padding: 8px 22px;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  form.body {
    padding: 0 1.5rem;
    width: min(500px, 90vw);

    div.content {
      height: min(560px, 90vh);
      overflow-y: auto;

      div {
        height: min-content;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        grid-gap: 3px;

        div {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 100%;
            aspect-ratio: 1/1;
            transition: filter 0.3s ease-in-out;
          }

          div.checkbox {
            position: absolute;
          }

          div.checkbox[aria-checked='false'] {
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            transition-delay: 0.2s;
          }

          &:hover {
            img {
              filter: brightness(0.8);
            }

            div.checkbox {
              visibility: visible;
              opacity: 1;
            }
          }
        }
      }
    }

    div.actions {
      padding: 12px 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
    }
  }
</style>
