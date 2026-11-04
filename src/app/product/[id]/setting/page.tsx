'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import ProductEditor from '@app/upload/_component/ProductEditor';
import { ProductDetailType } from '@app/product/[id]/page';
import { getProduct } from '@app/product/[id]/_lib/getProduct';

type SettingProps = {
  params: {
    id: string;
  };
};
const ProductSetting = ({ params }: SettingProps) => {
  const productId = params.id;
  const queryClient = useQueryClient();
  const queryKey = ['product', productId] as const;

  const { data, isLoading, isError } = useQuery<ProductDetailType>({
    queryKey,
    queryFn: () =>
      getProduct(productId) as unknown as Promise<ProductDetailType>,
    initialData: () => queryClient.getQueryData<ProductDetailType>(queryKey),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(queryKey)?.dataUpdatedAt,
    staleTime: 5_000,
    enabled: !!productId
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center">상품 정보를 불러오는 중입니다.</div>
    );
  }

  if (isError || !data?.ok || !data.product) {
    return (
      <div className="p-8 text-center">상품 정보를 불러오지 못했습니다.</div>
    );
  }

  return (
    <ProductEditor
      key={productId}
      mode="edit"
      productId={productId}
      initialProduct={data.product}
    />
  );
};

export default ProductSetting;
