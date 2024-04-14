<script lang="ts">
  export let header: string;
</script>

<details open>
  <summary>{header}</summary>
  <slot />
</details>

<style lang="scss">
  details {
    margin: 20px;

    summary {
      margin: 0 0 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }
</style>
