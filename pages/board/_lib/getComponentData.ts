import { getFetch } from '@libs/client/fetcher';
import { useQuery } from 'react-query';

export const GetComponentData = <T>(boardSearch: string) => {
  return useQuery<T>(
    ['boards', boardSearch],
    getFetch(`/api/board${boardSearch === '' ? '' : '?search=' + boardSearch}`),
    {
      staleTime: 60000,
      cacheTime: 5 * 60000
    }
  );
};
