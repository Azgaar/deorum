<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { MATCH_NAMES_NUMBER, PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { patchPortraitName } from '$lib/api/patchPortrait';
  import { request, preloadImage } from '$lib/utils/requests';
  import { report } from '$lib/utils/log';
  import { toastError } from '$lib/stores';
  import PushButton from '$lib/components/buttons/PushButton.svelte';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';

  export let data: import('./$types').PageData;
  $: key = data.current.id;
  $: preloadImage(`${PORTRAITS_IMAGE_PATH}/${data.next.id}/${data.next.image}`);

  let customName = '';

  const handleClick = (name: string) => (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    target.classList.add('hidden');

    patchPortraitName(key, name);
  };

  const requestMoreSamples = async () => {
    try {
      const url = `/api/names/ironarachne?quantity=${MATCH_NAMES_NUMBER}&race=${data.race}&type=${data.type}`;
      const moreNames = await request<string[]>(url);
      data.names = moreNames;
    } catch (error) {
      report('match names', error);
      toastError(error);
    }
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

  <section class="container">
    {#each data.names as name (Math.random())}
      <div class="line">
        {name}
        <PushButton
          variant="green"
          onClick={handleClick(name)}
          label={$t('common.controls.select')}
        />
      </div>
    {/each}

    <div class="line">
      <input
        type="text"
        min="2"
        maxlength="50"
        placeholder={$t('admin.match.typeCustomName')}
        bind:value={customName}
      />
      {#key customName}
        <PushButton
          variant="green"
          onClick={handleClick(customName)}
          label={$t('common.controls.select')}
        />
      {/key}
    </div>

    <div class="line">
      <BasicButton variant="primary" onClick={requestMoreSamples}
        >{$t('admin.match.moreSamples')}</BasicButton
      >

      <a href={`./${data.next?.id}`}>
        {$t('common.controls.next')} &rarr;
      </a>
    </div>
  </section>
</div>

<style lang="scss">
  @use 'sass:color';
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

    section.container {
      display: flex;
      flex-direction: column;
      gap: 0.4em;

      div.line {
        display: flex;
        justify-content: space-between;
        gap: 0.4em;

        input {
          width: 80%;
          color: $text;
          font-size: 1rem;
          text-indent: 0.2rem;
          outline: none;
          border: none;
          border-radius: 2px;
          background-color: color.adjust($secondary, $lightness: +3%);
        }

        a {
          text-transform: lowercase;
          text-decoration: none;
          color: $text;
          font-size: 0.9em;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>
