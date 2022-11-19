export const pluralize = (word: string, count: number): string => {
  return count > 1 ? `${word}s` : word;
};

export const capitalize = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
