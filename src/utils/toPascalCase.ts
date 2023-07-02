const toPascalCaseWord = (word: string): string => {
  const firstChar = word.charAt(0).toUpperCase();
  const rest = word.substring(1).toLowerCase();
  return firstChar.concat(rest);
};

export const toPascalCasePhrase = (words: string[]): string =>
  words.map((word) => toPascalCaseWord(word)).join(" ");
