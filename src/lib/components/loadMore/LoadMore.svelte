<script lang="ts">
  import Button, { Label } from '@smui/button';

  export let onClick: () => void;
</script>

<div class="loadMore">
  <Button variant="raised" on:click={onClick}>
    <Label>Load more</Label>
  </Button>
</div>

<style lang="scss">
  .loadMore {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -70px;
  }
</style>
