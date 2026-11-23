'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getFetch } from '@libs/client/fetcher';
import ProductEditor from '@app/upload/_component/ProductEditor';

type UserResponse = { ok: boolean; user?: { id: number } };

export default function BoardUploadPage() {
  const router = useRouter();
  const { data, isLoading } = useQuery<UserResponse>({
    queryKey: ['current-user'],
    queryFn: () => getFetch('/api/user')
  });

  useEffect(() => {
    if (!isLoading && !data?.user?.id) router.replace('/board');
  }, [data, isLoading, router]);

  if (isLoading || !data?.user?.id)
    return <div className="p-8 text-center">로그인 상태를 확인 중입니다.</div>;

  return <ProductEditor mode="create" defaultUploadType="board" />;
}
