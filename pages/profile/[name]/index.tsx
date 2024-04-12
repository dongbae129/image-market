import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';

import { useState } from 'react';
import { HashTag, Product, ProductHit, User } from '@prisma/client';

import ImgSphere from '@components/imgSphere';
interface ProfileResponse {
  ok: boolean;
  products: (Product & {
    hashtag: HashTag;
    productHit: ProductHit;
  })[];
  user: User;
}
const UserProfile: NextPage = () => {
  const router = useRouter();
  const [hashtag, setHashtag] = useState(new Set<string>());

  const hashtags: string[] = Array.from(hashtag);
  console.log(router, 'router');
  const { data } = useQuery<ProfileResponse>(
    ['userInfo', router.query.name],
    getFetch(`/api/user/${router.query.name}`),
    {
      enabled: !!router.query.name,
      onSuccess: (res) => {
        console.log(res, 'Res');
        res.products?.forEach((tag) => {
          tag.hashtag?.hashtag
            .split(',')
            .forEach((v) => setHashtag((prev) => prev.add(v)));
        });
      }
      // staleTime: 1000 * 60
    }
  );
  console.log(data, 'data');

  return (
    <div className="profile-wrap">
      <div className="product-3d">
        {data?.products ? (
          <ImgSphere user={data.user} products={data.products} />
        ) : null}
        {/* <Threetest /> */}
      </div>
    </div>
  );
};

export default UserProfile;
