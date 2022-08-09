import type { NextPage } from 'next';
// import styles from '@styles/ProductDetail.module.scss';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Image from 'next/image';
import { Product } from '@prisma/client';
interface OnlyemailUser {
  user: {
    email: string;
  };
}
interface ProductDetail {
  product: Product & OnlyemailUser;
}
const ProductDetail: NextPage = () => {
  const router = useRouter();
  const { productId } = router.query;

  const getProduct = () =>
    axios.get(`/api/product/${productId}`).then((res) => res.data);
  const { data, isLoading } = useQuery<ProductDetail>(
    ['getProduct'],
    getProduct,
    {
      enabled: !!productId
    }
  );

  console.log(data?.product);
  if (isLoading) return <div>Loading Data....</div>;
  return (
    <div className="productWrap">
      <div className="productInfo">
        <div className="imagewrap">
          {data?.product && (
            <Image
              src={`/uploads/${data?.product.image}`}
              width={400}
              height={400}
              layout="responsive"
              alt=""
            />
          )}
        </div>
      </div>
      <div className="spring-wrap">
        {Array(5)
          .fill(0)
          .map((v, i) => (
            <div key={i} className="spring">
              <div></div>
              <div></div>
            </div>
          ))}
      </div>
      <div className="userInfo">
        <div>
          <span className="userimage">{/* <img src="" alt="" /> */}</span>
          <span className="useremail">{data?.product?.user?.email}</span>
          <button>팔로우</button>
        </div>
        <div>
          <button>다운로드</button>
          <ul>
            <li>화소 free, pay</li>
            <li>화소 free, pay</li>
            <li>화소 free, pay</li>
          </ul>
        </div>
      </div>
      <style jsx>{`
        @mixin spring {
          content: '';
          width: 265%;
          height: 15%;
          border-radius: 50%;

          border: 3px solid black;
          border-left-width: 5px;
          border-right-width: 5px;
          border-bottom: none;
          position: absolute;
        }
        .productWrap {
          position: relative;
          margin: 0 auto;
          margin-top: 30px;

          display: flex;
          width: 60%;
          height: 90vh;

          > div:nth-child(odd) {
            border: 1px solid black;
            border-radius: 5px;
            padding: 5%;
          }
          > div:nth-child(3) {
            padding-left: 7%;
          }
        }
        .productInfo {
          position: relative;
          width: 49%;

          .imagewrap {
            position: relative;

            width: 100%;
            height: 100%;
          }
        }

        .userInfo {
          width: 49%;
        }
        .spring-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 2%;
          height: 100%;
          .spring {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 20%;
          }
          .spring > div {
            position: absolute;

            width: 150%;
            height: 5%;
            border: 1px solid black;
            border-radius: 4px;
            &:nth-child(1) {
              right: 170%;
            }
            &:nth-child(2) {
              left: 170%;
            }

            &:nth-child(1)::after {
              @include spring;
              top: 20%;
              left: 40%;
            }
            &:nth-child(2)::before {
              @include spring;
              top: 60%;
              transform-origin: left;
              transform: rotateY(180deg);
              left: calc(60% + 1px);
            }
          }
        }
        .useremail {
          margin-right: 5px;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
