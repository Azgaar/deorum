<script lang="ts">
  import { getContext } from 'svelte';

  import Content from './Content.svelte';
  import type { Carousel } from '../carousel';

  const { currentItem }: Carousel = getContext('carousel');
</script>

<div class="wrapper">
  <Content item={$currentItem} />
</div>

<style lang="scss">
  @use 'sass:color';

  div.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 14px;
    font-family: Helvetica, sans-serif;
    color: #dee7ea;

    padding: 16px 32px;
    @media ($mobile) {
      padding: 0;
    }
  }
</style>
