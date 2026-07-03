import { Product, User } from '@prisma/client';

type ProductClient = {
  ok: boolean;
  product: Product & {
    user: User;
  };
  timeExpired?: 'R' | 'F' | 'P';
};

export const getProduct = async (productId: string): Promise<ProductClient> => {
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
