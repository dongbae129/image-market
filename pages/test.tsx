import axios from 'axios';
import type { NextPage } from 'next';
import { useQuery } from 'react-query';

const Test: NextPage = () => {
  const { data, isLoading } = useQuery('/api/test', () =>
    axios.get('api/test').then((res) => res.data)
  );
  if (isLoading) return <div>Loading...</div>;
  return <div>{data?.user?.name}111</div>;
};

export default Test;
