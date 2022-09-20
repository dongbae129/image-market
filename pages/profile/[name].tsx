import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';
import { userResponse } from '../index';
import Link from 'next/link';
import { useState } from 'react';
import { HashTag, Product, ProductHit, User } from '@prisma/client';
import Image from 'next/image';
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
  const [hashtag, setHashtag] = useState(new Set());

  const { data } = useQuery<ProfileResponse>(
    ['userInfo'],
    getFetch(`/api/user/${router.query.name}`),
    {
      enabled: !!router.query.name,
      onSuccess: (res) => {
        res.products.forEach((tag) => {
          tag.hashtag.hashtag
            .split(',')
            .forEach((v) => setHashtag((prev) => prev.add(v)));
        });
      }
      // staleTime: 1000 * 60
    }
  );

  return (
    <div>
      <div>
        <Link href="/profile/settings">
          <a>
            <button>설정</button>
          </a>
        </Link>
      </div>
      <div>
        <div>
          <div>{/* <img src="" alt="" /> */}</div>
          <div>
            <span>name</span>
            <h3>{data?.user?.name}</h3>
          </div>
          <div>
            <span>email</span>
            <h4>{data?.user?.email}</h4>
          </div>
        </div>
        <div>
          <h3>사진태그</h3>
          <div>
            {Array.from(hashtag).map((v, i) => (
              <span key={i}>#{v}</span>
            ))}
          </div>
        </div>
        <div>
          {data?.products?.map((product, i) => (
            <div key={i} style={{ border: '1px solid black', width: '102px' }}>
              <Image
                src={`/uploads/${product.image}`}
                alt=""
                width={200}
                height={200}
              />
              <br />
              {product.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
