<script lang="ts">
  import { t } from '$lib/locales/translations';

  export let label: ILabel | undefined;
  export let type: string;

  interface ILabel {
    image: string;
    name: string;
  }

  let text = $t(`admin.${type}.${label?.name}`);
</script>

<div class="label">
  <img src={label?.image} alt={label?.name} />
  <span title={text}>{text}</span>
</div>

<style lang="scss">
  div.label {
    display: flex;
    align-items: center;
    gap: 4px;

    img {
      width: 14px;
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
