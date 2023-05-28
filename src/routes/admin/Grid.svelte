<div class="grid">
  <slot />
</div>

<style lang="scss">
  div.grid {
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));

    @media (max-width: 1199px) {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }

    @media (max-width: 899px) {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    @media ($mobile) {
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    }
  }
</style>
