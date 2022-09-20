<script lang="ts">
  import ImageList, { Item, ImageAspectContainer, Image } from '@smui/image-list';
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
  let selected: string[] = [];

  const collectionId = portraits[0]?.['@collectionId'];
  const imagesPath = `${URL}/api/files/${collectionId}`;

  const handleClick = (id: string) => () => {
    selected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
  };
</script>

<ImageList class="my-image-list-standard">
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
