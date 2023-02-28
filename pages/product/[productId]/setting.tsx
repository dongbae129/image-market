import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';
import UploadImage from '@components/uploadImage';
import ProductDetail from './index';

const ProductSetting: NextPage = () => {
  const router = useRouter();
  const { productId } = router.query;

  const { data } = useQuery<ProductDetail>(
    ['getProduct'],
    getFetch(`/api/product/${productId}`),
    {
      enabled: !!productId
    }
  );
  console.log(data, 'pro');
  return (
    <div className="uploadwrap">
      <div>
        <UploadImage
          url={`prodcut/${productId}`}
          component={['title', 'description']}
          elementType={['input', 'textarea']}
          buttontext={['수정']}
          buttonColor={[]}
          hashtrue={true}
          labelTrue={true}
          image="true"
          elementValue={{
            title: data?.product.title,
            description: data?.product.description,
            hashtag: data?.product.hashtag.hashtag
          }}
        />
      </div>
      <style jsx>{`
        .uploadwrap {
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          > div {
            width: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductSetting;
