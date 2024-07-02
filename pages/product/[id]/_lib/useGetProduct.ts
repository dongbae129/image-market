import { HashTag, Product, ProductHit } from '@prisma/client';
import axios from 'axios';
import { useQuery } from 'react-query';

type UserHashtagHit = {
  user: {
    email: string;
    name: string;
  };
  hashtag: HashTag;
  productHit: ProductHit;
};
type ProductDetailType = {
  ok: boolean;
  product: Product & UserHashtagHit;
};

export const useGetProduct = (productId: string) => {
  const getProduct = () =>
    axios.get(`/api/product/${productId}`).then((res) => res.data);
  const { data, isLoading } = useQuery<ProductDetailType>(
    ['getProduct'],
    getProduct,
    {
      enabled: !!productId
    }
  );
  return { data, isLoading };
};
