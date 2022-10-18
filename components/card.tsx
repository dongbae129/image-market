import type { NextPage } from 'next';
import { Product } from '@prisma/client';
import { useState, useRef } from 'react';

interface CardProduct {
  product: Product;
  index: number;
}
const Card = ({ product, index }: CardProduct) => {
  const divRef = useRef<HTMLDivElement>(null);
  //   if (divRef.current) {
  //     divRef.current.style.transform = `translate(${-index * 10}px,${
  //       -index * 10
  //     }px)`;
  //   }
  return (
    <>
      <div ref={divRef} className="product-card">
        {product.id}
      </div>
      <style jsx>{`
        .productcard-wrap {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .product-card {
          width: 150px;
          height: 150px;
          border: 2px solid black;
          border-radius: 10px;
          background-color: lightblue;
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: calc(-1 * ${index});
          transform: translate(
            calc(-50% + (-10px * ${index})),
            calc(-50% + (-10px * ${index}))
          );
        }
      `}</style>
    </>
  );
};

export default Card;
