'use client';
import axios from 'axios';
import type { NextPage } from 'next';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useSearchParams } from 'next/navigation';
import { Product } from '@prisma/client';
import { useEffect } from 'react';
import MasonryProduct from '@app/_components/masonryProduct';
import { useInView } from 'react-intersection-observer';

interface SearchProductData {
  products: Product[];
}
interface InfinteProducts {
  products: Product[];
  productDatas: {
    pageParams: undefined | number[];
    pages: {
      products: Product[];
    }[];
  };
}
const Search: NextPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const getSearchData = ({ pageParam = 0 }) =>
    axios
      .get(`/api/product?id=${pageParam}&search=${search}`)
      .then((res) => res.data);
  // const { data, isLoading, refetch } = useQuery<SearchProductData>(
  //   ['getSearchData'],
  //   getFetch(`/api/product?search=${search}`),
  //   {
  //     enabled: !!search,
  //     onSuccess: () => console.log(search, 'usequerySearch')
  //   }
  // );
  const {
    data,

    hasNextPage,
    fetchNextPage,

    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['getSearchProducts', search],
    queryFn: getSearchData,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPage) => {
      const lastPageLength = lastPage.products.length;
      if (lastPageLength === 0 || lastPageLength < 3) return undefined;
      return lastPageLength >= 3 && lastPage.products[lastPageLength - 1].id;
    },
    enabled: !!search
  });
  const { ref, inView } = useInView({
    threshold: 0.3
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  // data?.pages[0].products[0]

  return (
    <>
      {data && data?.pages[0].products?.length > 0 ? (
        <MasonryProduct viewref={ref} productDatas={data}>
          {isFetchingNextPage ? (
            <div>Loading...</div>
          ) : (
            <div ref={ref} style={{ height: '100px' }}></div>
          )}
        </MasonryProduct>
      ) : (
        <div>없어요</div>
      )}

      {/* {data?.products && search && data?.products?.length > 0 ? (
        data?.products.map((product) => (
          <div key={product.id}>{product.title}</div>
        ))
      ) : (
        <div>없어요</div>
      )} */}
    </>
  );
};

export default Search;
