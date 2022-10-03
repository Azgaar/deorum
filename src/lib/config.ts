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
