<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { patchPortraitTags } from '$lib/api/patchPortrait';
  import Label from '$lib/components/label/Label.svelte';
  import PushButton from '$lib/components/buttons/PushButton.svelte';
  import { preloadImage } from '$lib/utils/loading';

  export let data: import('./$types').PageData;
  $: key = data.current.id;
  $: preloadImage(data.next);

  const handleClick = (event: MouseEvent, add: boolean, tagId: string) => {
    patchPortraitTags(key, add, tagId);

    const target = event.target as HTMLElement;
    target.classList.add('hidden');
  };
</script>

<div class="container">
  <section class="portrait">
    {#key key}
      <img
        width={320}
        height={320}
        src={`${PORTRAITS_IMAGE_PATH}/${data.current.id}/${data.current.image}`}
        alt="portrait"
      />
    {/key}
  </section>

  <section class="tags">
    {#each data.tags as tag (data.current.id + tag.id)}
      <div class="tag">
        <PushButton
          variant="red"
          onClick={(event) => handleClick(event, false, tag.id)}
          label={$t('common.controls.no')}
        />

        <Label label={tag} type="tags" />

        <PushButton
          variant="green"
          onClick={(event) => handleClick(event, true, tag.id)}
          label={$t('common.controls.yes')}
        />
      </div>
    {/each}
  </section>
</div>

<style lang="scss">
  div.container {
    width: min(320px, 100%);
    padding: 1.4rem;
    background-color: $secondary;
    font-size: 20px;

    section.portrait {
      margin-bottom: 0.4em;

      img {
        width: 100%;
        aspect-ratio: 1;
      }
    }

    section.tags {
      display: flex;
      flex-direction: column;
      gap: 0.4em;

      div.tag {
        display: flex;
        justify-content: space-between;
        gap: 0.4em;
      }
    }
  }
</style>
