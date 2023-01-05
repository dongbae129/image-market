import axios from 'axios';
import type { NextPage } from 'next';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Product } from '@prisma/client';
import { getFetch } from '@libs/client/fetcher';
import { useEffect, useRef, useState } from 'react';
import MasonryProduct from '@components/masonryProduct';
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
  const router = useRouter();
  const search = router.query.find?.toString();

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
    isLoading,
    isFetchingNextPage
  } = useInfiniteQuery<any, any, InfinteProducts>(
    ['getSearchProducts', search],
    getSearchData,
    {
      getNextPageParam: (lastPage, allPage) => {
        const lastPageLength = lastPage.products.length;
        if (lastPageLength === 0 || lastPageLength < 6) return false;
        return lastPageLength >= 6 && lastPage.products[lastPageLength - 1].id;
      },
      enabled: !!search
    }
  );
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
