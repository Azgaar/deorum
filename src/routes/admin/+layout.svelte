<main>
  <slot />
</main>

<style lang="scss">
  @use 'sass:color';

  main {
    height: 100vh;
    overflow: hidden;
    user-select: none;

    display: grid;
    grid-template-columns: 3fr minmax(360px, 1fr);
    grid-template-areas: 'gallery pane';

    @media ($mobile) {
      grid-template-columns: 1fr;
      grid-template-rows: 3fr 1fr;
      grid-template-areas: 'pane' 'gallery';
    }
  }

  :global(.imageContainer:hover div.mdc-checkbox__background) {
    transition: all 0.3s ease-in-out;
    border-color: color.adjust($text, $alpha: -0.1) !important;
  }
</style>
