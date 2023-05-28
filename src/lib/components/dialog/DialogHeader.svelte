<script lang="ts">
  export let handleCancel: VoidFunction | null = null;
</script>

<hgroup class="dialog-header">
  <h2 id="dialog-title">
    <slot />
  </h2>

  {#if handleCancel}
    <button class="close-button" on:click={handleCancel}>
      <span>&times;</span>
    </button>
  {/if}
</hgroup>

<style lang="scss">
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      width: 100%;
      color: $text;
      font-size: 18px;
      font-weight: 300;
      margin: 0;
    }

    .close-button {
      background-color: transparent;
      border: none;
      cursor: pointer;
      font-size: 24px;

      color: $text;
      transition: color 0.2s;

      &:hover {
        color: #999;
      }
    }
  }
</style>
