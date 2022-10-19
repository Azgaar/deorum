import { Role } from './stores/auth';

export const URL = 'https://deorum.fly.dev';

export const ORIGINALS_IMAGE_PATH = `${URL}/api/files/xdi3wpvo8djw6n3`;
export const PORTRAITS_IMAGE_PATH = `${URL}/api/files/ovnifljz2gtnz5u`;

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

const getColorSpan = (color: string) =>
  `<span style="font-size: smaller; vertical-align: text-bottom; color: ${color}">⬤</span>`;

export const colorsMap = new Map([
  [
    'red',
    {
      name: 'red',
      emoji: getColorSpan('red'),
      image: 'https://images.emojiterra.com/google/noto-emoji/v2.034/128px/1f534.png'
    }
  ],
  [
    'orange',
    {
      name: 'orange',
      emoji: getColorSpan('orange'),
      image: 'https://images.emojiterra.com/google/noto-emoji/v2.034/128px/1f7e0.png'
    }
  ],
  [
    'yellow',
    {
      name: 'yellow',
      emoji: getColorSpan('yellow'),
      image: 'https://images.emojiterra.com/google/noto-emoji/v2.034/128px/1f7e1.png'
    }
  ],
  [
    'green',
    {
      name: 'green',
      emoji: getColorSpan('green'),
      image: 'https://images.emojiterra.com/google/noto-emoji/v2.034/128px/1f7e2.png'
    }
  ],
  [
    'blue',
    {
      name: 'blue',
      emoji: getColorSpan('blue'),
      image:
        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/large-blue-circle_1f535.png'
    }
  ],
  [
    'lightblue',
    {
      name: 'lightblue',
      emoji: getColorSpan('lightblue'),
      image: 'https://images.emojiterra.com/google/noto-emoji/v2.034/128px/1f535.png'
    }
  ],
  [
    'purple',
    {
      name: 'purple',
      emoji: getColorSpan('purple'),
      image:
        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/large-purple-circle_1f7e3.png'
    }
  ],
  [
    'pink',
    {
      name: 'pink',
      emoji: getColorSpan('pink'),
      image:
        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/whatsapp/326/large-purple-circle_1f7e3.png'
    }
  ],
  [
    'brown',
    {
      name: 'brown',
      emoji: getColorSpan('brown'),
      image: 'https://images.emojiterra.com/google/noto-emoji/v2.034/128px/1f7e4.png'
    }
  ],
  [
    'black',
    {
      name: 'black',
      emoji: getColorSpan('black'),
      image: 'https://images.emojiterra.com/google/noto-emoji/v2.034/512px/26ab.png'
    }
  ],
  [
    'white',
    {
      name: 'white',
      emoji: getColorSpan('white'),
      image:
        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/facebook/327/white-circle_26aa.png'
    }
  ],
  [
    'grey',
    {
      name: 'grey',
      emoji: getColorSpan('grey'),
      image: 'https://images.emojiterra.com/google/noto-emoji/v2.034/512px/26aa.png'
    }
  ]
]);

export const numbersMap = new Map(
  ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾', '❿'].map((emoji, i) => [
    String(i + 1),
    {
      emoji,
      name: String(i + 1),
      image: `https://icons.iconarchive.com/icons/barkerbaggies/pool-ball/256/Ball-${
        i + 1
      }-icon.png`
    }
  ])
);

export const qualities = Array(10)
  .fill(0)
  .map((_, i) => i + 1);

const permissions = {
  filter: [Role.GUEST, Role.USER, Role.ADMIN],
  edit: [Role.USER, Role.ADMIN],
  upload: [Role.ADMIN]
};

export const permitted = (role: Role) => (action: keyof typeof permissions) => {
  const requiredRoles = permissions[action];
  return requiredRoles.includes(role);
};
