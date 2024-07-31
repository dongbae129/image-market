import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import NextImage from 'next/future/image';
import { Product } from '@prisma/client';
import { useInfiniteQuery } from 'react-query';
import { newAxios } from '@libs/client/fetcher';
import { useInView } from 'react-intersection-observer';

function ResponsiveProducts() {
  const [divWidth, setDivWidth] = useState(0);
  const getProducts = ({ pageParam = 0 }) =>
    newAxios.get(`/api/product?id=${pageParam}`).then((res) => res.data);

  const countRef = useRef<HTMLDivElement>(null);
  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery<any>(['getProducts'], getProducts, {
      getNextPageParam: (lastPage, allPage) => {
        const lastPageLength = lastPage.products.length;
        if (lastPageLength === 0 || lastPageLength < 6) return false;
        return lastPageLength >= 6 && lastPage.products[lastPageLength - 1].id;
      }
    });
  const { ref, inView } = useInView({
    threshold: 0.3
  });
  useEffect(() => {
    if (countRef.current) {
      const test = +window
        .getComputedStyle(countRef.current)
        .getPropertyValue('width')
        .slice(0, -2);

      const size =
        +window
          .getComputedStyle(countRef.current)
          .getPropertyValue('font-size')
          .slice(0, -2) * 3;
      setDivWidth((test - size) / 4);
      console.log('in');
    }
    console.log('out');
  }, []);
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);
  return (
    <>
      <div className="product-wrap" ref={countRef}>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5, 1200: 6 }}
        >
          <Masonry
            /*columnsCount={masonryColumn}*/ gutter="1em"
            className="mas"
          >
            {data ? (
              data.pages.map((products) =>
                products.products.map((product: Product) => (
                  <div
                    key={product.id}
                    className="product"
                    style={{ height: divWidth * Number(product.ratio) }}
                    ref={ref}
                  >
                    {divWidth ? (
                      <Link href={`/product/${product.id}`} passHref>
                        <a className="imgwrap">
                          <NextImage
                            alt=""
                            src={`/uploads/${product.image}`}
                            // layout="fill"
                            fill={true}
                            // width={'100%'}
                            // height={divWidth * Number(product.ratio)}
                            sizes="33vw"
                            // objectFit="contain"
                            // style={{
                            //   // width: '100%',
                            //   height: divWidth * Number(product.ratio),
                            //   objectFit: 'fill'
                            // }}
                            // priority={true}
                          />
                        </a>
                      </Link>
                    ) : (
                      <></>
                    )}
                    <span className="product-title">{product.title}</span>
                  </div>
                ))
              )
            ) : (
              <></>
            )}
          </Masonry>
        </ResponsiveMasonry>
        {isFetchingNextPage ? (
          <div>Loading...</div>
        ) : (
          <div ref={ref} style={{ height: '100px' }}></div>
        )}
      </div>
      <style jsx>{`
        .product-wrap {
          width: 94vw;
          margin: 0 auto;
          .imgwrap {
            position: relative;
            cursor: pointer;
            display: block;
            width: 100%;
            height: 90%;
            border-radius: 20px;
            overflow: hidden;
          }

          .product-title {
            display: inline-block;
          }
        }
        .imgwrap:hover {
          filter: brightness(60%);
        }
      `}</style>
    </>
  );
}

export default ResponsiveProducts;
