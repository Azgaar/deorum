export const getRandomIndex = (length: number): number => {
  return Math.floor(Math.random() * length);
};

export function getRandomElements<T>(arr: T[], n: number): T[] {
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
}
