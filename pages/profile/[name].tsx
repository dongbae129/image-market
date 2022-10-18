import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';
import { userResponse } from '../index';
import Link from 'next/link';
import { useState } from 'react';
import { HashTag, Product, ProductHit, User } from '@prisma/client';
import Image from 'next/image';
import Threetest from 'pages/threetest';
import Card from '@components/card';
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
  const { data } = useQuery<ProfileResponse>(
    ['userInfo'],
    getFetch(`/api/user/${router.query.name}`),
    {
      enabled: !!router.query.name,
      onSuccess: (res) => {
        res.products.forEach((tag) => {
          tag.hashtag?.hashtag
            .split(',')
            .forEach((v) => setHashtag((prev) => prev.add(v)));
        });
      }
      // staleTime: 1000 * 60
    }
  );

  return (
    <div className="profile-wrap">
      <div className="user-info">
        <div className="user-card">
          <Link href="/profile/settings">
            <a>
              <button>설정</button>
            </a>
          </Link>
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
        </div>
      </div>

      <div className="product-tag">
        <div>
          <h3>사진태그</h3>
          <div>
            {hashtag ? hashtags.map((v, i) => <span key={i}>#{v}</span>) : null}
          </div>
        </div>
        <div>
          {/* {data?.products?.map((product, i) => (
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
          ))} */}
        </div>
      </div>
      <div className="product-2d">
        {data?.products?.map((product, i) => (
          <Card key={product.id} index={i} product={product} />
        ))}
      </div>
      <div className="product-3d">
        {data?.products ? <ImgSphere user={data.products} /> : null}
        {/* <Threetest /> */}
      </div>
      <style jsx>{`
        .profile-wrap {
          position: relative;
          display: grid;
          width: 90vw;
          margin: 0 auto;
          height: 95vh;

          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 20px;
        }
        .user-info {
          display: flex;
          align-items: center;
          border: 1px solid black;

          .user-card {
            width: 70%;
            height: 70%;
            margin: 0 auto;
            border: 2px solid black;
          }
        }
        .product-tag {
          border: 1px solid red;
        }
        .product-2d {
          position: relative;
          border: 1px solid blue;
        }
        .product-3d {
          width: 100%;
          border: 1px solid green;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
