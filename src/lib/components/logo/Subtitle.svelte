<script lang="ts">
  export let size: number;
</script>

<h2 style="font-size: {size}px">
  <slot />
</h2>

<style lang="scss">
  h2 {
    font-family: 'Times New Roman', serif;
    font-style: italic;
    font-weight: 400;
    margin: 0;
    margin-top: -6px;
    text-shadow: 2px -1px 1px rgb(70 37 35 / 31%);
  }
</style>
