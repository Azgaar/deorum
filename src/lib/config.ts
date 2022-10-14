import { Role } from './stores/auth';

export const URL = 'https://deorum.fly.dev';

export const ORIGINALS_IMAGE_PATH = `${URL}/api/files/xdi3wpvo8djw6n3`;
export const PORTRAITS_IMAGE_PATH = `${URL}/api/files/ovnifljz2gtnz5u`;

export const COOKIE_NAME = 'pb_auth';

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

export const colorsMap = new Map(
  colors.map((color) => [color, { emoji: getColorSpan(color), name: color }])
);

export const numbersMap = new Map(
  ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'].map((emoji, i) => [
    String(i + 1),
    { emoji, name: String(i + 1) }
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
