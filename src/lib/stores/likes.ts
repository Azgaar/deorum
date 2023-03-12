import { writable } from 'svelte/store';

type TLikes = { [key: string]: boolean };

const createLikesStore = () => {
  const { subscribe, set, update } = writable<TLikes>({});

  return {
    subscribe,
    toggle: (id: string) => update((prev) => ({ ...prev, [id]: !prev[id] })),
    set: (likes: TLikes) => set(likes),
    reset: () => set({}),
    count: (likes: TLikes) => Object.values(likes).filter(Boolean).length
  };
};

export const likes = createLikesStore();
