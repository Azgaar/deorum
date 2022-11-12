<script lang="ts">
  import { t } from '$lib/locales/translations';

  export let label: ILabel | undefined;
  export let type: string;
  export let maxWidth: string = 'inherit';

  interface ILabel {
    image?: string;
    name?: string;
  }

  let text = label?.name ? $t(`admin.${type}.${label.name}`, { default: label.name }) : '';
</script>

<div class="label" style="max-width: {maxWidth}">
  {#if label?.image}
    <img src={label.image} alt={label.name} />
  {/if}
  <span title={text}>{text}</span>
</div>

<style lang="scss">
  div.label {
    display: flex;
    align-items: center;
    gap: 0.2em;

    img {
      width: 1em;
      height: min-content;
      aspect-ratio: 1;
    }

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
