import type { NextPage } from 'next';
// import styles from '@styles/ProductDetail.module.scss';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Image from 'next/image';
const ProductDetail: NextPage = () => {
  const router = useRouter();
  const { productId } = router.query;

  const getProduct = () =>
    axios.get(`/api/product/${productId}`).then((res) => res.data);
  const { data, isLoading } = useQuery(['getProduct'], getProduct, {
    enabled: !!productId
  });

  console.log(data?.product);
  if (isLoading) return <div>Loading Data....</div>;
  return (
    <div>
      <div className="test">
        {data?.product && (
          <Image
            src={`/uploads/${data?.product.image}`}
            width={100}
            height={100}
            alt=""
          />
        )}
      </div>
      <div>
        <div>
          <span>{/* <img src="" alt="" /> */}</span>
          <span>username</span>
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
        .test {
          border: 10px solid red;
          &:hover {
            transform: scale(2);
            transition: 2s;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
