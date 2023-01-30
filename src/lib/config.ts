export const URL = 'https://deorum.fly.dev';

export const ORIGINALS_IMAGE_PATH = `${URL}/api/files/xdi3wpvo8djw6n3`;
export const PORTRAITS_IMAGE_PATH = `${URL}/api/files/ovnifljz2gtnz5u`;
export const RACES_IMAGE_PATH = `${URL}/api/files/muaq37oeccoi92j`;

export const COOKIE_NAME = 'pb_auth';

export const BATCH_SIZE = 200;

export const colors = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'lightblue',
  'purple',
  'pink',
  'brown',
  'black',
  'white',
  'grey'
];

export const qualities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const MATCH_TAGS_NUMBER = 6;
export const MATCH_NAMES_NUMBER = 5;

const convertableImageFormats = ['png', 'jpeg', 'jpg', 'gif'] as const;
export const convertableMimeTypes = convertableImageFormats.map((type) => `image/${type}`);

export const defaultFileName = 'deorum';

export const charactersConfig = {
  filter: '(inactive=false)',
  sort: 'id',
  expand: 'race,archetype,background,portraits',
  batch: 15
};
