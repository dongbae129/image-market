import type { NextPage } from 'next';
import { useMutation, useQuery } from 'react-query';
import { getFetch, newAxios } from '@libs/client/fetcher';
import { useState } from 'react';
import UploadImage from '@components/uploadImage';
import { useRouter } from 'next/router';
import axios from 'axios';
import Modal from '@components/modal';

const BoardSetting: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const boardId = router.query.id;
  console.log(boardId);
  const { data } = useQuery(['getBoard'], getFetch(`/api/board/${boardId}`), {
    enabled: !!boardId
  });
  const deleteSend = () =>
    newAxios.delete(`/api/board/${boardId}`).then((res) => res.data);
  const { mutate: deleteMutation } = useMutation(deleteSend, {
    onSuccess: (res) => {
      console.log(res, 'deleted success');
      router.replace('/board');
    },
    onError: (res) => {
      console.error(res, 'deleted fail');
      setModalOpen(false);
      alert('해당 게시물을 삭제하는데 실패했어요!!');
    }
  });
  console.log(data, 'Data');
  return (
    <div className="settingwrap">
      {modalOpen && (
        <Modal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          deleteMutation={deleteMutation}
        />
      )}

      <UploadImage
        url={`board`}
        component={['title', 'description']}
        elementType={['input', 'textarea']}
        buttontext={['삭제', '수정']}
        hashtrue={true}
        buttonColor={['#dee2e6']}
        labelTrue={true}
        setModalOpen={() => setModalOpen((prev) => !prev)}
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
