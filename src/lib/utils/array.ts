export const getRandomIndex = (length: number): number => {
  return Math.floor(Math.random() * length);
};

export const getRandomElements = <T>(arr: T[], n: number): T[] => {
  const result = new Array(n);
  let length = arr.length;
  const taken = new Array(length);

  if (n > length) throw new RangeError('More elements taken than available');

  while (n--) {
    const x = Math.floor(Math.random() * length);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --length in taken ? taken[length] : length;
  }

  return result;
};

export const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const sliceElements = <T>(arr: T[], from: number, to: number): T[] => {
  if (from < 0) return [...arr.slice(from), ...arr.slice(0, to)];
  if (to > arr.length) return [...arr.slice(from, arr.length), ...arr.slice(0, to - arr.length)];

  return arr.slice(from, to);
};

export const isSameArray = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
};

export const unique = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

export function splitToChunks<T>(arr: T[], chunkSize: number): T[][] {
  const chunks = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
}
