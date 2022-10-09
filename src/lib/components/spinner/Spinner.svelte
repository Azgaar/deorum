<script lang="ts">
  export let hidden: boolean = false;
</script>

<div class="loader" class:hidden>
  <div />
  <div />
  <div />
</div>

<style lang="scss">
  div.loader {
    display: inline-block;
    position: relative;
    width: 80px;

    div {
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: $primary;
      animation: loader 1.5s linear infinite;
    }

    div:nth-child(1) {
      top: 8px;
      left: 8px;
      animation-delay: 0s;
    }

    div:nth-child(2) {
      top: 8px;
      left: 32px;
      animation-delay: -0.4s;
    }

    div:nth-child(3) {
      top: 8px;
      left: 56px;
      animation-delay: -0.8s;
    }

    @keyframes loader {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
  }

  div.hidden {
    visibility: hidden;
  }
</style>
