export const pluralize = (word: string, count: number): string => {
  return count > 1 ? `${word}s` : word;
};
