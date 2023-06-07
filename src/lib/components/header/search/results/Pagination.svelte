<script lang="ts">
  export let page: number;
  export let pages: number;
  export let onClick: (event: Event) => void;
</script>

<div class="pagination" on:click={onClick} on:keydown={onClick}>
  <button type="button" aria-label="Previous page" disabled={page < 2} data-page={page - 1}>
    &laquo;
  </button>

  {#if page > 1}<button type="button" data-page={page - 1}>{page - 1}</button>{/if}

  <button type="button" disabled aria-current>{page}</button>

  {#if page < pages}<button type="button" data-page={page + 1}>{page + 1}</button>{/if}

  {#if page === 1 && pages > 2}<button type="button" data-page={page + 2}>{page + 2}</button>{/if}

  <button type="button" aria-label="Next page" disabled={page === pages} data-page={page + 1}>
    &raquo;
  </button>
</div>

<style lang="scss">
  div.pagination {
    display: flex;
    gap: 0.5rem;

    button {
      padding: 0;
      width: 20px;
      height: 20px;
      border-radius: 0.25rem;
      border: none;
      background: none;

      display: flex;
      align-items: center;
      justify-content: center;

      color: rgba($color: $text, $alpha: 0.2);
      transition: all 0.2s ease-in-out;
      cursor: pointer;

      &:hover:not([disabled]) {
        color: rgba($color: $text, $alpha: 0.5);
      }

      &[disabled] {
        opacity: 0.5;
        cursor: default;
      }

      &[aria-current] {
        font-weight: bold;
        background-color: $on-surface;
        color: $text;
      }
    }
  }
</style>
