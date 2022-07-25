const deepCopy = (src: any[]) => src.map((v: any) => ({ ...v }));

export const shuffleArray = (array: any[]) => {
  const newArr = deepCopy(array);

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
};
