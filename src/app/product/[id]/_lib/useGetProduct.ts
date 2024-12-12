import { HashTag, Product, ProductHit } from '@prisma/client';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

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
  const { data, isLoading } = useQuery<ProductDetailType>({
    queryKey: ['getProduct'],
    queryFn: getProduct,

    enabled: !!productId
  });
  return { data, isLoading };
};
