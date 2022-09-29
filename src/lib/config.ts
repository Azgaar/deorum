export const URL = 'https://deorum.fly.dev';

const colors = [
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
