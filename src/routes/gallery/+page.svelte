<script lang="ts">
  import ImageList, { Item, ImageAspectContainer, Image } from '@smui/image-list';
  import IconButton from '@smui/icon-button';
  import Checkbox from '@smui/checkbox';

  import { URL } from '$lib/config';
  import type { IPortrait } from '$lib/api.types';
  import './styles.scss';

  export let data: {
    portraits: IPortrait[];
    tags: Map<string, string>;
    styles: Map<string, string>;
    originals: Map<string, string>;
    page: number;
  };

  const { portraits, originals } = data;
  const portraitsMap = new Map(portraits.map((p) => [p.id, p]));

  let selected: string[] = [];
  $: lastSelected = selected.length && portraitsMap.get(selected.at(-1)!);

  const collectionId = portraits[0]?.['@collectionId'];
  const imagesPath = `${URL}/api/files/${collectionId}`;

  const handleClick = (id: string) => () => {
    selected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
  };

  const handleClearSelection = () => {
    selected = [];
  };
</script>

<main>
  <ImageList class="gallery">
    {#each portraits as item (item.id)}
      <Item on:click={handleClick(item.id)}>
        <ImageAspectContainer>
          <div class="imageContainer">
            <Image
              loading="lazy"
              alt={originals.get(item.original)}
              src={`${imagesPath}/${item.id}/${item.image}`}
            />
            <div class="checkbox" class:hidden={!selected.length && !selected.includes(item.id)}>
              <Checkbox checked={selected.includes(item.id)} touch ripple={false} />
            </div>
          </div>
        </ImageAspectContainer>
      </Item>
    {/each}
  </ImageList>

  <div class="drawer" class:open={lastSelected}>
    <div class="drawerContent">
      {#if lastSelected}
        <ImageAspectContainer>
          <Image
            loading="lazy"
            alt={selected.at(0)}
            src={`${imagesPath}/${lastSelected.id}/${lastSelected.image}`}
          />

          <div class="imageOverlay" class:hidden={selected.length < 2}>
            <span>{selected.length}</span>
          </div>

          <IconButton
            on:click={handleClearSelection}
            class="material-icons closeButton"
            title="Remove">close</IconButton
          >
        </ImageAspectContainer>
      {/if}

      <ul>
        {#each selected as item}
          <li>{item}</li>
        {/each}
      </ul>
    </div>
  </div>
</main>
