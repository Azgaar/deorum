<script lang="ts">
  import type { TOptions } from '.';
  import Dialog from '../Dialog.svelte';
  import DialogAction from '../DialogAction.svelte';
  import DialogBody from '../DialogBody.svelte';
  import DialogFooter from '../DialogFooter.svelte';
  import DialogHeader from '../DialogHeader.svelte';

  let isOpen = false;
  let title = '';
  let body = '';
  let confirmButton = '';
  let cancelButton = '';
  let onConfirm: VoidFunction | null = null;
  let onCancel: VoidFunction | null = null;

  function handleConfirm() {
    onConfirm?.();
    close();
  }

  function handleCancel() {
    onCancel?.();
    close();
  }

  function open(options: TOptions) {
    isOpen = true;
    title = options.title;
    body = options.body;
    confirmButton = options.confirmButton || '';
    cancelButton = options.cancelButton || '';
    onConfirm = options.onConfirm || null;
    onCancel = options.onCancel || null;
  }

  function close() {
    isOpen = false;
    title = '';
    body = '';
    confirmButton = '';
    cancelButton = '';
    onConfirm = null;
    onCancel = null;
  }

  function handleOpen(event: CustomEvent<TOptions>) {
    open(event.detail);
  }
</script>

<svelte:window on:dialogOpen|capture={handleOpen} on:dialogClose|capture={close} />

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader {handleCancel}>
    {@html title}
  </DialogHeader>

  <DialogBody>
    {@html body}
  </DialogBody>

  <DialogFooter>
    <DialogAction handleClick={handleCancel}>
      {cancelButton}
    </DialogAction>

    <DialogAction handleClick={handleConfirm}>
      {confirmButton}
    </DialogAction>
  </DialogFooter>
</Dialog>
