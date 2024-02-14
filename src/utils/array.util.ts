/**
 * Stringify an array by putting "," and an "and" between each element.
 * @param arr The array to stringify
 * @param lang The language to use for the "and" word
 * @returns A stringified version of the array
 */
export const arrayToString = (arr: string[], lang = 'en'): string => {
  const and = lang === 'en' ? 'and' : 'et';

  if (arr.length === 1) return arr[0];
  return `${arr.slice(0, arr.length - 1).join(', ')} ${and} ${arr[arr.length - 1]}`;
};

export const filterNotNull = <T>(arr: (T | undefined | null)[]): T[] => {
  return arr.filter((el) => el !== undefined && el !== null) as T[];
};
