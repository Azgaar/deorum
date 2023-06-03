<script lang="ts">
  export let size: number;
</script>

<a href="/" aria-label="Logo" style="font-size: {size}px" translate="no">Deorum</a>

<style lang="scss">
  a {
    text-decoration: none;

    font-family: 'Times New Roman', serif;
    text-transform: uppercase;
    font-weight: 400;
    margin: 0;
    user-select: none;

    background-image: linear-gradient(100deg, #f6e27a 0%, #f6f2c0 5%, #f6e27a 25%, #ffed8a 100%);
    text-shadow: 3px -1px 1px #46252350;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;

    @media screen and ($mobile) {
      transform: scale(0.8);
    }
  }
</style>
