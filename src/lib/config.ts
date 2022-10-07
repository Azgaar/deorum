import { Role } from './stores/auth';

export const URL = 'https://deorum.fly.dev';

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
