import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';

import UploadImage from '@components/uploadImage';
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
    <div className="settingwrap">
      <UploadImage
        url={`board`}
        component={['title', 'description']}
        elementType={['input', 'textarea']}
        buttontext="수정"
        hashtrue={true}
      />
      <style jsx>{`
        .settingwrap {
          width: 50vw;
          margin: auto;
        }
      `}</style>
    </div>
  );
};

export default BoardSetting;
