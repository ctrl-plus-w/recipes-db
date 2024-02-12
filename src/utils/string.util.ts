export const capitalize = (word: string): string => {
  return word[0].toUpperCase() + word.slice(1);
};

export const capitalizeSentence = (sentence: string): string => {
  return sentence.split(' ').map(capitalize).join(' ');
};
