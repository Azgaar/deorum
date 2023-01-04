<script lang="ts">
  import { derivePrimaryImagePath } from '$lib/utils/characters';

  export let data: import('./$types').PageData;

  const { bio } = data.character;
  const image = derivePrimaryImagePath(data.character);

  console.log(data);
</script>

<main>
  <div class="container">
    <div class="left-column">
      <img src={image} alt="Character portrait" draggable="false" />
      <div class="list">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
      </div>
    </div>
    <div class="right-column">
      <textarea spellcheck="false">{bio}</textarea>
    </div>
  </div>
</main>

<style lang="scss">
  @use 'sass:color';
  $mobile: 'max-width: 599px';

  main {
    flex: 1;

    padding: 16px 32px;
    display: flex;
    justify-content: center;

    @media ($mobile) {
      padding: 0;
    }

    font-size: 14px;
    font-family: Helvetica, sans-serif;
    color: #dee7ea;

    .container {
      background-color: #000000b3;
      height: 100%;
      padding: 16px;
      display: grid;
      grid-gap: 16px;
      grid-template-columns: 1fr 2fr;

      @media ($mobile) {
        grid-template-columns: auto;
        grid-template-rows: auto 1fr;
      }

      .left-column {
        display: flex;
        flex-direction: column;
        gap: 16px;

        img {
          user-select: none;
          aspect-ratio: 1/1;
          width: 320px;

          @media ($mobile) {
            width: 100%;
            max-width: 380px;
          }
        }

        .list {
          display: flex;
          gap: 16px;
          flex-direction: column;
        }
      }

      .right-column {
        overflow: hidden;
        display: flex;

        textarea {
          flex: 1;
          padding: 0 8px 16px 0;
          line-height: 1.3;
          margin-top: -4px;

          color: inherit;
          font-size: inherit;
          font-family: inherit;

          background: none;
          border: none;
          outline: none;
          resize: none;
        }
      }
    }
  }
</style>
