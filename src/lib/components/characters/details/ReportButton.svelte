<script lang="ts">
  import { page } from '$app/stores';
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import Bug from '$lib/components/icons/Bug.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';

  export let item: IGalleryItem;

  let isOpen = false;
  let category = 'other';
  let message = '';

  const categories = [
    ['other', $t('common.details.report.categories.other')],
    ['inappropriate', $t('common.details.report.categories.inappropriate')],
    ['portrait', $t('common.details.report.categories.portrait')],
    ['biography', $t('common.details.report.categories.biography')],
    ['improvement', $t('common.details.report.categories.improvement')]
  ];

  const sendReport = async (e: SubmitEvent) => {
    e.preventDefault();

    try {
      const reporter = $page.data.userId;
      await request(`/api/characters/${item.id}/report`, 'POST', { category, message, reporter });
      message = '';
      isOpen = false;
    } catch (error) {
      report('report issue', error);
      toastError(error);
    }
  };
</script>

<ActionButton onClick={() => (isOpen = true)} title={$t('common.controls.report')}>
  <Bug width={28} />
</ActionButton>

<Dialog {isOpen}>
  <DialogHeader>
    {$t('common.controls.report')}
  </DialogHeader>

  <form on:submit={sendReport}>
    <DialogBody>
      <div class="body">
        <div>
          <div>{$t('common.details.report.category')}:</div>
          <Select bind:value={category} options={categories} />
        </div>

        <div>
          <textarea
            name="message"
            placeholder={$t('common.details.report.message')}
            bind:value={message}
          />
        </div>
      </div>
    </DialogBody>

    <DialogFooter>
      <DialogAction handleClick={() => (isOpen = false)}>
        {$t('common.controls.cancel')}
      </DialogAction>

      <DialogAction type="submit" disabled={!message}>
        {$t('common.controls.send')}
      </DialogAction>
    </DialogFooter>
  </form>
</Dialog>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .body {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      > div {
        width: 100%;
        display: flex;
        gap: 0.5rem;
        align-items: baseline;

        textarea {
          width: 100%;
          height: 200px;

          padding: 8px 8px 24px;
          background-color: rgb($secondary, 0.6);
          border: none;
          border-radius: 4px;
          outline: none;

          // reader mode
          font-size: 14px;
          color: #dee7ea;
          line-height: 1.3;
        }
      }
    }
  }
</style>
