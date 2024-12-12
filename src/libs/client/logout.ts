'use client';
import { useQueryClient } from '@tanstack/react-query';
import { newAxios } from './fetcher';
import store from '@reducers/store';
// import store from '../../reducers/store';
import { removeAccessToken, setRestoreState } from '@reducers/user';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      const { data } = await newAxios.post('/api/logout?type=local');
      if (data.ok) {
        delete newAxios.defaults.headers.common['authorization'];
        dispatch(removeAccessToken());
        dispatch(setRestoreState(false));
        queryClient.invalidateQueries({
          queryKey: ['userInfo']
        });
        router.push('/');
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
  return logout;
};
export default useLogout;
