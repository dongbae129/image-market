import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';

import Link from 'next/link';
import UploadImage from '@components/uploadImage';
import Input from '@components/input';
import { useRouter } from 'next/router';

const BoardSetting: NextPage = () => {
  const router = useRouter();
  const boardId = router.query.boardId;
  console.log(boardId);
  const { data } = useQuery(['getBoard'], getFetch(`/api/board/${boardId}`), {
    enabled: !!boardId
  });
  console.log(data, 'Data');
  return (
    <UploadImage
      url={`board/${boardId}`}
      component={['title', 'description']}
      elementType={['input', 'textarea']}
    />
  );
};

export default BoardSetting;
