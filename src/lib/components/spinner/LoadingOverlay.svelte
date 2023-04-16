<script lang="ts">
  import { navigating } from '$app/stores';
  import { isLoading } from '$lib/stores';
  import Spinner from './Spinner.svelte';

  $: isDisplayed = Boolean($navigating) || $isLoading;
</script>

<div aria-busy={isDisplayed} aria-label="loading overlay" class="loading">
  <Spinner />
</div>

<style lang="scss">
  @use 'sass:color';

  div.loading {
    position: fixed;
    inset: 0;
    background-color: color.adjust($surface, $alpha: -0.8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;

    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.2s linear;

    &[aria-busy='true'] {
      opacity: 1;
      visibility: visible;
    }
  }
</style>
