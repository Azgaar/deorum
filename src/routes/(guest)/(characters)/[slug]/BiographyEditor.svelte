<script lang="ts">
  import Dialog, { Title } from '@smui/dialog';

  import { t } from '$lib/locales/translations';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let open: boolean;
  export let item: IGalleryItem;

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const value = new FormData(event.target as HTMLFormElement).get('bio');
    item.bio = typeof value === 'string' ? value : '';
    open = false;
  };

  const scrollTop = (node: HTMLTextAreaElement) => {
    setTimeout(() => {
      node.focus();
      node.scrollTop = 0;
    }, 0);
  };
</script>

<Dialog bind:open class="dialog" aria-label="character biography editor" scrimClickAction="">
  <Title>
    {$t('common.details.editor.editBio')}
  </Title>

  <form class="body" on:submit={handleSubmit}>
    <div class="content">
      <textarea name="bio" value={item.bio} rows="20" use:scrollTop />
    </div>

    <div class="actions">
      <BasicButton variant="text" onClick={() => (open = false)}>
        {$t('common.controls.cancel')}
      </BasicButton>

      <BasicButton type="submit" variant="text">
        {$t('common.controls.apply')}
      </BasicButton>
    </div>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  form.body {
    padding: 0 1.5rem;

    div.content {
      display: flex;

      textArea {
        width: max(100%, 800px);
        height: max(100%, 600px);

        padding: 8px;
        background-color: $secondary;
        border: none;
        border-radius: 4px;
        outline: none;
        flex: 1;

        // reader mode
        font-size: 14px;
        color: #dee7ea;
        line-height: 1.3;
      }
    }

    div.actions {
      padding: 12px 0;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
