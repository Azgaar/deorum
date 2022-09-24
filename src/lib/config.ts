export const URL = 'https://deorum.fly.dev';

export const MAIN_IMAGE = '/main.png';

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
  `<span style="font-size: smaller; vertical-align: text-bottom; color: ${color}">⬤</span> ${color}`;

export const colorsMap = new Map(colors.map((color) => [color, getColorSpan(color)]));
