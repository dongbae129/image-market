'use client';
import { useQueryClient } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';
import axios from 'axios';

const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = async () => {
    try {
      const { data } = await axios.post('/api/auth/logout?type=local');
      if (data.success) {
        // queryClient.removeQueries({
        //   predicate: (query) => query.queryKey[0] !== 'getProducts' // 상품 피드만 살리고 다 삭제
        // });
        queryClient.setQueryData(['userInfo'], null);
        router.refresh();
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
  return logout;
};
export default useLogout;
