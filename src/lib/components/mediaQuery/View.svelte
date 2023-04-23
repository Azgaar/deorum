<script lang="ts">
  import { DESKTOP_LAYOUT_MIN_WIDTH } from '$lib/config';
  import MediaQuery from './MediaQuery.svelte';

  const mediaDesktop = `(max-width: ${DESKTOP_LAYOUT_MIN_WIDTH - 1}px)`;
</script>

<MediaQuery query={mediaDesktop} let:matches>
  {#if matches}
    <slot name="mobile" />
  {:else}
    <slot name="desktop" />
  {/if}
</MediaQuery>
