<script lang="ts">
  import Heart from '$lib/components/icons/Heart.svelte';

  export let likes: number;
  export let liked: boolean;
</script>

<div class="likeButton">
  <span>{likes}</span>
  <Heart fill={liked ? 'currentColor' : 'none'} width={20} />
</div>

<style lang="scss">
  .likeButton {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
</style>
