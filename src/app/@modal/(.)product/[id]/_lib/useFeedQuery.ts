'use client';
import { getProduct } from '@app/product/[id]/_lib/getProduct';
import { Product, User } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// hooks/useFeedDetail.ts
type ProductClient = {
  ok: boolean;
  product: Product & {
    user: User;
  };
};
export function useFeedDetail(productId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['product', +productId],
    queryFn: () => getProduct(productId),
    initialData: () => {
      // 리스트 캐시에서 초기 데이터(썸네일 등) 가져오기
      return queryClient.getQueryData<ProductClient>(['product', +productId]);
    }
    // placeholderData: () => {
    //   // 리스트 캐시에서 초기 데이터(썸네일 등) 가져오기
    //   return queryClient.getQueryData<ProductClient>(['product', +productId]);
    // }
    // staleTime: 60000 // 1분 동안은 캐시된 데이터 사용
  });
}
