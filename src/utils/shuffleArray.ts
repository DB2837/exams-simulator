const shallowCopy = <T extends object>(src: T[]) => src.map((value) => ({ ...value }));

export const shuffleArray = <T extends object>(
  array: T[],
  random: () => number = Math.random,
) => {
  const newArr = shallowCopy(array);

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
};

export const selectQuestionSet = <T extends object>(
  questionPool: T[],
  limit?: number,
  random: () => number = Math.random,
) => {
  const shuffledPool = shuffleArray(questionPool, random);
  return limit === undefined ? shuffledPool : shuffledPool.slice(0, limit);
};
