<script lang="ts">
  import { fly } from 'svelte/transition';
  import type { TOptions } from './dialog';

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

  function handleClose() {
    close();
  }
</script>

<svelte:window on:dialogOpen|capture={handleOpen} on:dialogClose|capture={handleClose} />

<template>
  {#if isOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <dialog
      class="dialog-wrapper"
      on:click={handleCancel}
      in:fly={{ x: 0, duration: 200 }}
      out:fly={{ x: 0, duration: 200 }}
    >
      <div
        class="dialog-container"
        on:click|stopPropagation
        in:fly={{ y: -100, duration: 300 }}
        out:fly={{ y: 0, duration: 300 }}
      >
        <div class="dialog-header">
          <h2>{@html title}</h2>

          <button class="close-button" on:click={handleCancel}>
            <span>&times;</span>
          </button>
        </div>

        <div class="dialog-body">{@html body}</div>

        {#if confirmButton || cancelButton}
          <div class="dialog-footer">
            {#if cancelButton}
              <button class="action-button" on:click={handleCancel}>
                {cancelButton}
              </button>
            {/if}

            {#if confirmButton}
              <button class="action-button" on:click={handleConfirm}>
                {confirmButton}
              </button>
            {/if}
          </div>
        {/if}
      </div>
    </dialog>
  {/if}
</template>

<style lang="scss">
  .dialog-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;

    .dialog-container {
      background-color: $surface;
      border-radius: 5px;
      box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
      padding: 20px 20px 14px;
      max-width: 600px;
      min-width: min(340px, 80vw);

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h2 {
          font-size: 20px;
          color: $text;
          margin: 0;
        }

        .close-button {
          background-color: transparent;
          border: none;
          cursor: pointer;
          font-size: 28px;
          color: $text;
          transition: color 0.2s;

          &:hover {
            color: #999999;
          }
        }
      }

      .dialog-body {
        font-size: 14px;
        color: $text;
        line-height: 1.5;
        margin-bottom: 20px;
      }

      .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;

        .action-button {
          background-color: transparent;
          border: none;
          color: $text;
          padding: 10px;
          font-size: 12px;
          text-transform: uppercase;
          transition: color 0.2s;
          cursor: pointer;

          &:hover {
            color: #999999;
          }
        }
      }
    }
  }
</style>
