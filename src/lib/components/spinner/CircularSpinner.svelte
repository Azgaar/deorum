<script lang="ts">
  export let size = 24;
  export let absolute = false;
</script>

<div class="loader" class:absolute style="width: {size}px; height: {size}px" />

<style lang="scss">
  .absolute {
    position: absolute;
  }

  .loader {
    aspect-ratio: 1;
    display: grid;
    -webkit-mask: conic-gradient(from 22deg, #0003, #000);
    mask: conic-gradient(from 22deg, #0003, #000);
    animation: load 1s steps(8) infinite;
  }

  .loader,
  .loader:before {
    --_g: linear-gradient(white 0 0) 50%;
    background: var(--_g) / 34% 8% space no-repeat, var(--_g) / 8% 34% no-repeat space;
  }

  .loader:before {
    content: '';
    transform: rotate(45deg);
  }

  @keyframes load {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(1turn);
    }
  }
</style>
