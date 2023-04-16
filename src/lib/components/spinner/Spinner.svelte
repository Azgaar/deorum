<div class="container">
  <div class="spinner" />
</div>

<style lang="scss">
  .container {
    font-size: 50px;
    color: $primary;
  }

  .spinner {
    border: 0.05em currentcolor solid;
    border-radius: 50%;
    position: relative;
    width: 100px;
    height: 100px;

    &:after,
    &:before {
      content: '';
      border-radius: 50%;
      position: absolute;
      width: inherit;
      height: inherit;
      animation: loader 2s infinite linear;
    }

    &:before {
      border-top: 0.2em currentcolor solid;
      top: -0.15em;
      left: calc(-50% - 0.15em);
      transform-origin: right center;
    }

    &:after {
      border-bottom: 0.2em currentcolor solid;
      top: 0.15em;
      right: calc(-50% - 0.15em);
      transform-origin: left center;
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
</style>
