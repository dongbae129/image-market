'use client';
import style from './ResponsiveProducts.module.scss';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Product } from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getProducts } from '@app/_libs/getProducts';
import { normalizeRatio } from '@app/_libs/normalizeRatio';
import style2 from './responsive.module.scss';
function ResponsiveProducts() {
  const [count, setCount] = useState(0);
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['getProducts'],
      queryFn: getProducts,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPage) => {
        const lastPageLength = lastPage.products.length;
        if (lastPageLength === 0 || lastPageLength < 6) return undefined;
        return lastPageLength >= 6 && lastPage.products[lastPageLength - 1].id;
      }
    });
  const pages = data?.pages ?? [];
  const items = pages.flatMap((p: any) => p.products ?? []);

  // useInfiniteQuery({
  //   queryKey: ['getProducts'],
  // queryFn: getProducts,
  // getNextPageParam: (lastPage, allPage) => {
  //   const lastPageLength = lastPage.products.length;
  //   if (lastPageLength === 0 || lastPageLength < 6) return false;
  //   return lastPageLength >= 6 && lastPage.products[lastPageLength - 1].id;
  // }
  // });

  const breakpoints = {
    0: count, // 0-639 -> 1
    640: 2, // 640-1023 -> 2
    1024: 3, // 1024-1439 -> 3
    1440: 6 // 1440+ -> 6
  };

  useLayoutEffect(() => {
    const width = window.innerWidth;

    if (width < 640) setCount(1);
    else if (width < 1024) setCount(2);
    else if (width < 1440) setCount(3);
    else setCount(6);
  }, []);

  const { ref, inView } = useInView({
    threshold: 0.3
  });
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);
  return (
    <>
      <div className={style.product_wrap}>
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            0: 5
            // 350: 2,
            // 750: 3,
            // 900: 5,
            // 1200: 6
          }}
          // columnsCountBreakPoints={breakpoints}
        >
          <Masonry gutter="1em" className="mas">
            {data?.pages?.map((products) =>
              products.products.map((product: Product) => (
                <div key={product.id}>
                  <div
                    className="product"
                    style={{
                      aspectRatio: 1 / normalizeRatio(+product.ratio)
                    }}
                  >
                    <Link href={`/product/${product.id}`} passHref>
                      <div className={style.imgwrap}>
                        <img alt="" src="/localimages/emptyuser.png" />
                      </div>
                    </Link>
                  </div>
                  <span className={style.product_title}>{product.title}</span>
                </div>
              ))
            )}
          </Masonry>
        </ResponsiveMasonry>
        {/* <div className={style2.masonry_placeholder} data-initial-columns={3}>
          {items.map((it: any) => (
            <div key={it.id} className={style2.m_item}>
              <div className={style2.card}>
                <div
                  className={style2.thumbnail}
                  style={{ aspectRatio: 1 / normalizeRatio(+it.ratio) }}
                />

                <div className={style2.meta}>{`#${it.title}`}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <ResponsiveMasonry columnsCountBreakPoints={breakpoints}>
            <Masonry gutter="16px">
              {items.map((it: any) => (
                <div key={'real-' + it.id} className={style2.m_item_real}>
                  <div className={style2.card}>
                    <div
                      className={style2.thumbnail}
                      style={{ height: it.h - 40 }}
                    />
                    <div className={style2.meta}>{`#${it.title}`}</div>
                  </div>
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div> */}
        {isFetchingNextPage ? (
          <div>Loading...</div>
        ) : (
          <div ref={ref} style={{ height: '100px' }}></div>
        )}
      </div>
      {/* <style jsx>{`
        .product-wrap {
          width: 94vw;
          margin: 0 auto;
          .imgwrap {
            position: relative;
            cursor: pointer;
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 20px;
            overflow: hidden;
          }
          img {
            width: 100%;
            height: 100%;
          }
          img .product-title {
            display: inline-block;
          }
        }
        .imgwrap:hover {
          filter: brightness(60%);
        }
      `}</style> */}
    </>
  );
}

export default ResponsiveProducts;
