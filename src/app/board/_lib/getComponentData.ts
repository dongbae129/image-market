import { getFetch } from '@libs/client/fetcher';
import { useQuery } from '@tanstack/react-query';

export const GetComponentData = <T>(boardSearch: string) => {
  return useQuery<T>({
    queryKey: ['boards', boardSearch],
    queryFn: getFetch(
      `/api/board${boardSearch === '' ? '' : '?search=' + boardSearch}`
    ),

    staleTime: 60000
  });
};
