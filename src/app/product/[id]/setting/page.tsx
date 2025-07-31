'use client';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { getFetch } from '@libs/client/fetcher';
import UploadImage from '@components/uploadImage';
import { ProductDetailType } from '@app/product/[id]/page';

type SettingProps = {
  params: {
    id: string;
  };
};
const ProductSetting = ({ params }: SettingProps) => {
  const router = useRouter();
  const productId = params.id;

  const { data } = useQuery<ProductDetailType>({
    queryKey: ['getProduct'],
    queryFn: getFetch(`/api/product/${productId}`),

    enabled: !!productId
  });
  console.log(data, 'pro');
  return (
    <div className="uploadwrap">
      <div>
        <UploadImage
          url={`product/${productId}/setting`}
          // component={['title', 'description', 'productAuth']}
          component={['productAuth', 'title', 'description']}
          elementType={['input', 'input', 'textarea']}
          buttontext={['수정']}
          buttonColor={[]}
          hashtrue={true}
          labelTrue={true}
          image="true"
          elementValue={{
            title: data?.product.title,
            description: data?.product.description,
            hashtag: data?.product.hashtag.hashtag,
            imgsrc: data?.product.image
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
