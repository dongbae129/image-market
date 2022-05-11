import { getFetch } from '@libs/client/fetcher';

import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

const Products: NextPage = () => {
  const { accessToken } = useSelector((state: any) => state.user);

  const header = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  const { data } = useQuery(['getProduct'], getFetch('/api/products', header));
  return <div>product test</div>;
};

export default Products;
