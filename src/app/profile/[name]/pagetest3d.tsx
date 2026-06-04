'use client';
import { useQuery } from '@tanstack/react-query';
import { getFetch } from '@libs/client/fetcher';

import { useState } from 'react';
import { HashTag, Product, ProductHit, User } from '@prisma/client';

import ImgSphere from '@app/_components/imgSphere';
interface ProfileResponse {
  ok: boolean;
  products: (Product & {
    hashtag: HashTag;
    productHit: ProductHit;
  })[];
  user: User;
}
type Props = {
  params: {
    name: string;
  };
};
const UserProfile = ({ params }: Props) => {
  // const [hashtag, setHashtag] = useState(new Set<string>());
  const { name } = params;
  const { data } = useQuery<ProfileResponse>({
    queryKey: ['userInfo', name],
    queryFn: getFetch(`/api/user/${name}`),

    enabled: !!name
    // select: (res) => {
    //   console.log(res, 'Res');
    //   res.products?.forEach((tag) => {
    //     tag.hashtag?.hashtag
    //       .split(',')
    //       .forEach((v) => setHashtag((prev) => prev.add(v)));
    //   });
    //   return res;
    // }
    // staleTime: 1000 * 60
  });

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
