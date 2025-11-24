export const getProducts = async ({ pageParam = 0 }): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product?id=${pageParam}`,
      {
        next: {
          tags: ['getProducts']
        }
      }
    );
    return res.json();
  } catch (error) {
    console.error(error);
    throw new Error('products server fail');
  }
};
