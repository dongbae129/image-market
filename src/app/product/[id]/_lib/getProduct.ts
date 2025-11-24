export const getProduct = async (productId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/${productId}`,
    {
      next: {
        tags: ['product', productId]
      }
      //   cache: 'no-store'
    }
  );

  if (!res.ok) throw new Error('board server fail');
  return res.json();
};
