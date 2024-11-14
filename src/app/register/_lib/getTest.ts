export const getTest = async () => {
  const data = await fetch(`/api/test`, {
    method: 'GET'
  });

  return data.json();
};
