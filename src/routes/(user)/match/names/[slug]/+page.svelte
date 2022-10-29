<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { MATCH_NAMES_NUMBER, PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { patchPortraitName } from '$lib/api/patchPortrait';
  import { request, preloadImage } from '$lib/utils/loading';
  import PushButton from '$lib/components/buttons/PushButton.svelte';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';

  export let data: import('./$types').PageData;
  $: key = data.current.id;
  $: preloadImage(data.next);

  const handleClick = (name: string) => (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    target.classList.add('hidden');

    patchPortraitName(key, name);
  };

  const requestMoreSamples = async () => {
    const moreNames = await request(`/api/names/random?quantity=${MATCH_NAMES_NUMBER}`);
    data.names = moreNames;
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

  <section class="names">
    {#each data.names as name (name)}
      <div class="name">
        {name}
        <PushButton
          variant="green"
          onClick={handleClick(name)}
          label={$t('common.controls.select')}
        />
      </div>
    {/each}

    <div class="more">
      <BasicButton
        variant="primary"
        onClick={requestMoreSamples}
        label={$t('admin.match.moreSamples')}
      />
    </div>
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

    section.names {
      display: flex;
      flex-direction: column;
      gap: 0.4em;

      div.name {
        display: flex;
        justify-content: space-between;
        gap: 0.4em;
      }

      div.more {
        display: flex;
        justify-content: center;
        gap: 0.4em;
      }
    }
  }
</style>
