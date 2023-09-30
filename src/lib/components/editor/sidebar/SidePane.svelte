<aside>
  <slot />
</aside>

<style lang="scss">
  aside {
    width: 100%;
    overflow: auto;

    grid-area: pane;
    background-image: url('/images/menu.webp');
    background-size: 100% 100%;

    display: flex;
    justify-content: center;

    @media ($mobile) {
      display: flex;
      justify-content: center;
      padding: 1rem 2rem;
      width: auto;
    }
  }
</style>
