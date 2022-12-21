import { Product } from '@prisma/client';
import Link from 'next/link';
import { useEffect, useState, useRef, ReactNode } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import NextImage from 'next/future/image';

// interface InfiniteMasonry {}
interface MasonryComponentProps {
  productDatas: {
    pageParams: unknown[];
    pages: {
      products: Product[];
    }[];
  };
  viewref: (node?: Element | null | undefined) => void;
  children: ReactNode;
}

const MasonryProduct = ({
  productDatas,
  viewref,
  children
}: MasonryComponentProps) => {
  const countRef = useRef<HTMLDivElement>(null);
  const [divWidth, setDivWidth] = useState(0);
  console.log(productDatas, 'masonry');
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
    }
  }, []);
  // const {ref, inView} = useInView({
  //     threshold: 0.3
  // })
  return (
    <div className="product-wrap" ref={countRef}>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5, 1200: 6 }}
      >
        <Masonry /*columnsCount={masonryColumn}*/ gutter="1em" className="mas">
          {productDatas ? (
            productDatas.pages.map((products) =>
              products.products.map((product: Product) => (
                <div key={product.id} className="product" ref={viewref}>
                  {divWidth ? (
                    <Link href={`/product/${product.id}`} passHref>
                      <div className="imgwrap">
                        <NextImage
                          alt=""
                          src={`/uploads/${product.image}`}
                          // layout="fill"
                          // fill={true}
                          width={divWidth}
                          height={divWidth * Number(product.ratio)}
                          sizes="33vw"
                          style={{ width: '100%', height: '100%' }}
                          priority
                        />
                      </div>
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
      {children}
      <style jsx>{`
        .product-wrap {
          width: 93vw;
          margin: 0 auto;

          .imgwrap {
            position: relative;
            display: block;
            width: 100%;
            height: 90%;
            border-radius: 20px;
            overflow: hidden;
          }
          .product {
          }

          .product-title {
            display: inline-block;
          }
        }

        .imgwrap:hover {
          filter: brightness(60%);
        }
      `}</style>
    </div>
  );
};

export default MasonryProduct;
