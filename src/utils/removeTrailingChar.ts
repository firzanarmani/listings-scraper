export const removeTrailingChar = (str: string, char: string) => {
  if (str.charAt(str.length - 1) === char) {
    return str.substring(0, str.length - 1);
  }

  return str;
};
