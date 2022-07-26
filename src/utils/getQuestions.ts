export const getQuestions = async (path: string) => {
  const response = await fetch(path, {
    method: 'GET',
  });

  const data = await response.json();
  return data;
};
