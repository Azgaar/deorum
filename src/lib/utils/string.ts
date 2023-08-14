export const pluralize = (word: string, count: number): string => {
  return count > 1 ? `${word}s` : word;
};

export const capitalize = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// trim text to the nearest space after the min length and add ellipsis
export const trimText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, text.lastIndexOf(' ', maxLength))}...`;
};
