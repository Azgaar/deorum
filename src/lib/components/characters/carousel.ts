import { PORTRAITS_IMAGE_PATH } from '$lib/config';
import { galleryId, toastError } from '$lib/stores';
import type { IGalleryItem } from '$lib/types/gallery.types';
import { sliceElements } from '$lib/utils/array';
import { report } from '$lib/utils/log';
import { preloadImage, request } from '$lib/utils/requests';
import { get, writable, type Subscriber, type Writable } from 'svelte/store';

const CURRENT_INDEX = 2;
const TAIL_IMAGES = 2;
const LOAD_ON_IMAGES_LEFT = 8;

export class Carousel {
  items: IGalleryItem[];
  currentId: string;
  isLoadingMore: boolean;

  // Svelte reactive store with items currently displayed in the carousel
  carousel: Writable<IGalleryItem[]>;
  currentItem: Writable<IGalleryItem>;

  constructor(items: IGalleryItem[], currentId: string) {
    this.items = items;
    this.currentId = currentId;
    this.isLoadingMore = false;

    this.carousel = writable();
    this.currentItem = writable();

    this.updateCarousel(this.items, this.currentId);
    this.preloadImages(this.items);
  }

  // slice items array to get carousel items
  public updateCarousel(items: IGalleryItem[], currentId: string) {
    this.items = items;
    const currentIdx = items.findIndex(({ id }) => id === currentId);
    this.currentItem.set(items[currentIdx]);

    const before = sliceElements(items, currentIdx - TAIL_IMAGES, currentIdx);
    const after = sliceElements(items, currentIdx + 1, currentIdx + 1 + TAIL_IMAGES);
    this.carousel.set([...before, items[currentIdx], ...after]);

    galleryId.set(currentId);
  }

  // lazily preload images that comes initially, but not displayed in the carousel
  private preloadImages(items: IGalleryItem[]) {
    const carouselIds = get(this.carousel).map(({ id }) => id);
    const initialItemsInReserve = items.filter(({ id }) => !carouselIds.includes(id));
    initialItemsInReserve.forEach((item) => {
      preloadImage(`${PORTRAITS_IMAGE_PATH}/${item.image}`);
    });
  }

  // load more items from the server
  private async loadMore(right: boolean) {
    if (this.isLoadingMore) return;
    this.isLoadingMore = true;

    const edgeId = right ? this.items.at(-1)?.id : this.items.at(0)?.id;

    try {
      const moreItems = await request<IGalleryItem[]>(
        `/api/gallery/more?edgeId=${edgeId}&right=${right}`
      );

      this.items = right ? [...this.items, ...moreItems] : [...moreItems, ...this.items];
      this.updateCarousel(this.items, this.currentId);
      this.preloadImages(moreItems);
    } catch (error) {
      report('gallery', error, { right });
      toastError(error);
    } finally {
      this.isLoadingMore = false;
    }
  }

  public update(updatedItem: IGalleryItem) {
    const updatedItems = this.items.map((item) => {
      if (item.id === updatedItem.id) return updatedItem;
      return item;
    });

    this.items = updatedItems;
    this.updateCarousel(updatedItems, this.currentId);
  }

  // move carousel right or left
  public move(right: boolean) {
    const nextIndex = right ? CURRENT_INDEX + 1 : CURRENT_INDEX - 1;
    const nextId = get(this.carousel)[nextIndex].id;

    history.pushState({}, '', `./${nextId}`); // don't trigger server update

    this.currentId = nextId;
    this.updateCarousel(this.items, nextId);

    const dataIndex = this.items.findIndex(({ id }) => id === nextId);
    const itemsBeforeEnd = Math.min(dataIndex, this.items.length - dataIndex);
    if (itemsBeforeEnd < LOAD_ON_IMAGES_LEFT) this.loadMore(right);
  }

  public next = () => {
    this.move(true);
  };

  public prev = () => {
    this.move(false);
  };

  public subscribe(run: Subscriber<IGalleryItem[]>) {
    return this.carousel.subscribe(run);
  }
}
