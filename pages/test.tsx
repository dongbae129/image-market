import axios from 'axios';
import type { NextPage } from 'next';
import { useQuery } from 'react-query';

const Test: NextPage = () => {
  const test = {
    aa: 'AA',
    bb: 1234,
    cc: ' CC'
  };
  async function tstfc() {
    const data = axios
      .post('/api/test', JSON.stringify(test), {
        headers: {
          'Content-Type': `application/json`
        }
      })
      .then((res) => {
        console.log(res.data, '****');
        return res.data;
      })
      .catch((err) => console.log(err));
    return data;
  }
  // const { data } = axios.post('/api/test', test).then((res) => res.data);
  tstfc();
  // console.log(data, '!@!@!');
  return <div>test!!!</div>;
  // const { data, isLoading } = useQuery('/api/test', () =>
  //   axios.get('api/test').then((res) => res.data)
  // );
  // if (isLoading) return <div>Loading...</div>;
  // return <div>{data?.user?.name}111</div>;
};

export default Test;
