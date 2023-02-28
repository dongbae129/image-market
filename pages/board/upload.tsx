import UploadImage from '@components/uploadImage';
import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { userResponse } from '@components/headmenu';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const BoardUpload: NextPage = () => {
  const { data } = useQuery<userResponse>(['userInfo']);
  const router = useRouter();
  useEffect(() => {
    if ((data && !data?.ok) || (data && !data?.user.id)) {
      router.push('/board');
    }
  }, []);

  return (
    <div className="boarduploadwrap">
      <UploadImage
        url="board"
        component={['title', 'description']}
        elementType={['input', 'textarea']}
        buttontext={['등록']}
        buttonColor={[]}
        labelTrue={true}
        hashtrue={true}
      />
      <style jsx>{`
        .boarduploadwrap {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          max-width: 40rem;
          box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
          margin: auto;
          margin-top: 2rem;
          padding: 2.5rem;
          padding-bottom: 10px;
          padding-top: 2rem;
        }
      `}</style>
    </div>
  );
};

export default BoardUpload;
